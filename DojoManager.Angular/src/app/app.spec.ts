import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { App } from './app';

describe('App', () => {
  it('renders the main shell with header and footer', () => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    });

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('app-header')).not.toBeNull();
    expect(element.querySelector('main')).not.toBeNull();
    expect(element.querySelector('app-footer')).not.toBeNull();
  });
});