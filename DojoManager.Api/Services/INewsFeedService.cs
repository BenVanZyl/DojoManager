using DojoManager.Api.Models;

namespace DojoManager.Api.Services;

public interface INewsFeedService
{
    Task<IReadOnlyList<NewsItem>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<NewsItem?> GetByIdAsync(string id, CancellationToken cancellationToken = default);
}
