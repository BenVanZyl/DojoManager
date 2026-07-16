import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { environment } from '../../environments/environment';
import { NewsItem } from '../models/news-item';
import { NewsFeedService } from './news-feed.service';

describe('NewsFeedService', () => {
  let service: NewsFeedService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiBaseUrl}/api/news`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(NewsFeedService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('requests the news feed collection', () => {
    const response: NewsItem[] = [
      {
        id: '1',
        title: 'Summer Camp Announced',
        summary: 'Registration is now open.',
        publishedUtc: '2026-07-10T00:00:00Z',
        category: 'Events',
        url: '/news/1',
      },
    ];

    service.getNews().subscribe((items) => {
      expect(items).toEqual(response);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });

  it('requests an individual news item by id', () => {
    const response: NewsItem = {
      id: '5',
      title: 'Dojo Closed For Holiday',
      summary: 'Classes resume Monday.',
      publishedUtc: '2026-07-11T00:00:00Z',
      category: 'Announcements',
      url: '/news/5',
    };

    service.getNewsById('5').subscribe((item) => {
      expect(item).toEqual(response);
    });

    const req = httpMock.expectOne(`${baseUrl}/5`);
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });
});