namespace DojoManager.Api.Models;

public sealed class NewsItem
{
    public required string Id { get; init; }

    public required string Title { get; init; }

    public required string Summary { get; init; }

    public required string PublishedUtc { get; init; }

    public required string Category { get; init; }

    public required string Url { get; init; }
}
