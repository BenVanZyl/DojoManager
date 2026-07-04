using System.Security.Cryptography;
using System.Text;
using System.Threading.RateLimiting;
using DojoManager.Api.Services;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);
var securitySettings = builder.Configuration.GetSection("Security");
var allowedOrigins = securitySettings.GetSection("AllowedOrigins").Get<string[]>() ?? [];
var apiKeyHash = securitySettings["ApiKeySha256"];
var angularDistPath = Path.GetFullPath(Path.Combine(
    builder.Environment.ContentRootPath,
    "..",
    "DojoManager.Angular",
    "dist",
    "DojoManager",
    "browser"));
var angularAppAvailable = Directory.Exists(angularDistPath);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularClient", policy =>
    {
        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("NewsFeedPolicy", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 30,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
                AutoReplenishment = true
            }));
});
builder.Services.AddScoped<INewsFeedService, NewsFeedService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

if (angularAppAvailable)
{
    var angularFiles = new PhysicalFileProvider(angularDistPath);
    app.UseDefaultFiles(new DefaultFilesOptions
    {
        FileProvider = angularFiles,
        RequestPath = string.Empty
    });
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = angularFiles,
        RequestPath = string.Empty
    });
}

app.UseCors("AngularClient");
app.UseRateLimiter();

app.Use(async (context, next) =>
{
    if (!context.Request.Path.StartsWithSegments("/api", StringComparison.OrdinalIgnoreCase))
    {
        await next();
        return;
    }

    if (IsAllowedBrowserOrigin(context, allowedOrigins) || HasValidApiKey(context.Request.Headers["X-Api-Key"], apiKeyHash))
    {
        await next();
        return;
    }

    context.Response.StatusCode = StatusCodes.Status403Forbidden;
    await context.Response.WriteAsJsonAsync(new
    {
        message = "Request origin is not allowed. Use the approved Angular host or a valid API key."
    });
});

var newsEndpoints = app.MapGroup("/api/news")
    .RequireRateLimiting("NewsFeedPolicy");

newsEndpoints.MapGet("/", async (INewsFeedService newsFeedService, CancellationToken cancellationToken) =>
{
    var items = await newsFeedService.GetAllAsync(cancellationToken);
    return Results.Ok(items);
});

newsEndpoints.MapGet("/{id}", async (string id, INewsFeedService newsFeedService, CancellationToken cancellationToken) =>
{
    var item = await newsFeedService.GetByIdAsync(id, cancellationToken);
    return item is null ? Results.NotFound() : Results.Ok(item);
});

if (angularAppAvailable)
{
    app.MapFallback(async context =>
    {
        if (context.Request.Path.StartsWithSegments("/api", StringComparison.OrdinalIgnoreCase))
        {
            context.Response.StatusCode = StatusCodes.Status404NotFound;
            return;
        }

        context.Response.ContentType = "text/html; charset=utf-8";
        await context.Response.SendFileAsync(Path.Combine(angularDistPath, "index.html"));
    });
}

app.Run();

static bool IsAllowedBrowserOrigin(HttpContext context, IReadOnlyCollection<string> allowedOrigins)
{
    if (allowedOrigins.Count == 0)
    {
        return false;
    }

    if (TryGetAllowedOrigin(context.Request.Headers.Origin, allowedOrigins, out _))
    {
        return true;
    }

    if (TryGetAllowedOrigin(context.Request.Headers.Referer, allowedOrigins, out _))
    {
        return true;
    }

    var currentOrigin = $"{context.Request.Scheme}://{context.Request.Host}";
    return allowedOrigins.Contains(currentOrigin, StringComparer.OrdinalIgnoreCase);
}

static bool TryGetAllowedOrigin(string? headerValue, IReadOnlyCollection<string> allowedOrigins, out string origin)
{
    origin = string.Empty;
    if (string.IsNullOrWhiteSpace(headerValue) || !Uri.TryCreate(headerValue, UriKind.Absolute, out var uri))
    {
        return false;
    }

    origin = uri.GetLeftPart(UriPartial.Authority);
    return allowedOrigins.Contains(origin, StringComparer.OrdinalIgnoreCase);
}

static bool HasValidApiKey(string? providedApiKey, string? configuredApiKeyHash)
{
    if (string.IsNullOrWhiteSpace(providedApiKey) || string.IsNullOrWhiteSpace(configuredApiKeyHash))
    {
        return false;
    }

    var providedHash = SHA256.HashData(Encoding.UTF8.GetBytes(providedApiKey));
    return CryptographicOperations.FixedTimeEquals(
        providedHash,
        Convert.FromHexString(configuredApiKeyHash));
}
