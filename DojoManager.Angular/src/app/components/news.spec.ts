import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';

import { NewsItem } from '../models/news-item';
import { NewsFeedService } from '../services/news-feed.service';
import { News } from './news';

describe('News', () => {
  const sampleItem: NewsItem = {
    id: '1',
    title: 'Tournament Results',
    summary: 'Our students earned three medals.',
    publishedUtc: '2026-07-12T00:00:00Z',
    category: 'Competition',
    url: '/news/1',
  };

  it('shows a loading message before the service responds', () => {
    const stream = new Subject<NewsItem[]>();
    const newsFeedService = {
      getNews: vi.fn(() => stream.asObservable()),
    };

    TestBed.configureTestingModule({
      imports: [News],
      providers: [
        provideRouter([]),
        { provide: NewsFeedService, useValue: newsFeedService },
      ],
    });

    const fixture = TestBed.createComponent(News);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Loading latest news...');
  });

  it('renders news cards when the service returns data', () => {
    const newsFeedService = {
      getNews: vi.fn(() => of([sampleItem])),
    };

    TestBed.configureTestingModule({
      imports: [News],
      providers: [
        provideRouter([]),
        { provide: NewsFeedService, useValue: newsFeedService },
      ],
    });

    const fixture = TestBed.createComponent(News);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('Tournament Results');
    expect(text).toContain('Read more');
    expect(newsFeedService.getNews).toHaveBeenCalledTimes(1);
  });

  it('shows an empty-state message when there are no news items', () => {
    const newsFeedService = {
      getNews: vi.fn(() => of([])),
    };

    TestBed.configureTestingModule({
      imports: [News],
      providers: [
        provideRouter([]),
        { provide: NewsFeedService, useValue: newsFeedService },
      ],
    });

    const fixture = TestBed.createComponent(News);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'No news available right now.',
    );
  });

  it('shows a friendly error message when the service fails', () => {
    const newsFeedService = {
      getNews: vi.fn(() => throwError(() => new Error('service unavailable'))),
    };

    TestBed.configureTestingModule({
      imports: [News],
      providers: [
        provideRouter([]),
        { provide: NewsFeedService, useValue: newsFeedService },
      ],
    });

    const fixture = TestBed.createComponent(News);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'News service is currently unavailable. Please try again shortly.',
    );
  });
});