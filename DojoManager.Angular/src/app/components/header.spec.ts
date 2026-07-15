import { TestBed } from '@angular/core/testing';

import { environment } from '../../environments/environment';
import { Header } from './header';

describe('Header', () => {
  it('shows the configured app title', () => {
    TestBed.configureTestingModule({
      imports: [Header],
    });

    const fixture = TestBed.createComponent(Header);
    fixture.detectChanges();

    const title = (fixture.nativeElement as HTMLElement).querySelector('.logo-text')?.textContent;
    expect(title?.trim()).toBe(environment.appTitle);
  });

  it('toggles the mobile menu class when button is clicked', () => {
    TestBed.configureTestingModule({
      imports: [Header],
    });

    const fixture = TestBed.createComponent(Header);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const button = host.querySelector('.mobile-menu-btn') as HTMLButtonElement;
    const mobileNav = host.querySelector('.mobile-nav') as HTMLElement;

    expect(mobileNav.classList.contains('open')).toBe(false);

    button.click();
    fixture.detectChanges();
    expect(mobileNav.classList.contains('open')).toBe(true);

    button.click();
    fixture.detectChanges();
    expect(mobileNav.classList.contains('open')).toBe(false);
  });
});