import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params, provideRouter } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';

import { NewsItem } from '../models/news-item';
import { NewsFeedService } from '../services/news-feed.service';
import { NewsDetail } from './news-detail';

describe('NewsDetail', () => {
  const article: NewsItem = {
    id: '42',
    title: 'Seminar With Sensei',
    summary: 'Special technical seminar this Saturday.',
    publishedUtc: '2026-07-13T00:00:00Z',
    category: 'Training',
    url: '/news/42',
  };

  it('loads and displays the selected article from route id', () => {
    const params$ = new Subject<Params>();
    const newsFeedService = {
      getNewsById: vi.fn(() => of(article)),
    };

    TestBed.configureTestingModule({
      imports: [NewsDetail],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { params: params$.asObservable() } },
        { provide: NewsFeedService, useValue: newsFeedService },
      ],
    });

    const fixture = TestBed.createComponent(NewsDetail);
    fixture.detectChanges();

    params$.next({ id: '42' });
    fixture.detectChanges();

    expect(newsFeedService.getNewsById).toHaveBeenCalledWith('42');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Seminar With Sensei');
  });

  it('shows an error message when loading the article fails', () => {
    const params$ = new Subject<Params>();
    const newsFeedService = {
      getNewsById: vi.fn(() => throwError(() => new Error('not found'))),
    };

    TestBed.configureTestingModule({
      imports: [NewsDetail],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { params: params$.asObservable() } },
        { provide: NewsFeedService, useValue: newsFeedService },
      ],
    });

    const fixture = TestBed.createComponent(NewsDetail);
    fixture.detectChanges();

    params$.next({ id: 'missing-id' });
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'News article not found or service is unavailable.',
    );
  });
});