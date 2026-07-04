import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { NewsItem } from '../models/news-item';
import { NewsFeedService } from '../services/news-feed.service';

@Component({
  selector: 'app-news',
  imports: [DatePipe, RouterLink],
  templateUrl: './news.html',
  styleUrl: './news.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class News {
  private readonly newsFeedService = inject(NewsFeedService);

  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);
  readonly newsItems = signal<NewsItem[]>([]);
  readonly hasNews = computed(() => this.newsItems().length > 0);

  constructor() {
    this.loadNews();
  }

  private loadNews(): void {
    this.newsFeedService.getNews().subscribe({
      next: (items) => {
        this.newsItems.set(items);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('News service is currently unavailable. Please try again shortly.');
        this.isLoading.set(false);
      },
    });
  }

}
