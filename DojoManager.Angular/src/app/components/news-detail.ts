import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { NewsItem } from '../models/news-item';
import { NewsFeedService } from '../services/news-feed.service';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './news-detail.html',
  styleUrl: './news-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsDetail {
  private readonly newsFeedService = inject(NewsFeedService);
  private readonly route = inject(ActivatedRoute);

  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);
  readonly newsItem = signal<NewsItem | null>(null);

  constructor() {
    this.loadNewsDetail();
  }

  private loadNewsDetail(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.newsFeedService.getNewsById(id).subscribe({
          next: (item) => {
            this.newsItem.set(item);
            this.isLoading.set(false);
          },
          error: () => {
            this.error.set('News article not found or service is unavailable.');
            this.isLoading.set(false);
          },
        });
      }
    });
  }
}
