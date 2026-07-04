import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { NewsItem } from '../models/news-item';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NewsFeedService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiBaseUrl}/api/news`;

  getNews(): Observable<NewsItem[]> {
    return this.http.get<NewsItem[]>(this.endpoint);
  }

  getNewsById(id: string): Observable<NewsItem> {
    return this.http.get<NewsItem>(`${this.endpoint}/${id}`);
  }
}
