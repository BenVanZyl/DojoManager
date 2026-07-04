using System.Text.Json;
using DojoManager.Api.Models;

namespace DojoManager.Api.Services;

public sealed class NewsFeedService(IHostEnvironment hostEnvironment) : INewsFeedService
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public async Task<IReadOnlyList<NewsItem>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var items = await ReadNewsItemsAsync(cancellationToken);

        return items
            .OrderByDescending(item => ParseDate(item.PublishedUtc))
            .ToArray();
    }

    public async Task<NewsItem?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        var items = await ReadNewsItemsAsync(cancellationToken);

        return items.FirstOrDefault(item => string.Equals(item.Id, id, StringComparison.OrdinalIgnoreCase));
    }

    private async Task<List<NewsItem>> ReadNewsItemsAsync(CancellationToken cancellationToken)
    {
        var filePath = Path.Combine(hostEnvironment.ContentRootPath, "Data", "news.json");

        if (!File.Exists(filePath))
        {
            return [];
        }

        await using var stream = File.OpenRead(filePath);
        var items = await JsonSerializer.DeserializeAsync<List<NewsItem>>(stream, JsonOptions, cancellationToken);

        return items ?? [];
    }

    private static DateTimeOffset ParseDate(string publishedUtc)
    {
        return DateTimeOffset.TryParse(publishedUtc, out var parsed)
            ? parsed
            : DateTimeOffset.MinValue;
    }
}
