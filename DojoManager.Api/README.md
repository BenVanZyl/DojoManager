# DojoManager.Api

.NET 10 REST API that serves news feed data for the Angular frontend.

## Run locally

```bash
dotnet run --project DojoManager.Api.csproj --urls http://localhost:5099
```

## Endpoints

- `GET /api/news` returns all news items sorted by `publishedUtc` descending.
- `GET /api/news/{id}` returns a single news item by ID.

## Data source

News data is read from `Data/news.json`.
