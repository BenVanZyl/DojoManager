import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { Home } from './components/home';
import { NewsDetail } from './components/news-detail';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'news/:id', component: NewsDetail },
  { path: '**', redirectTo: '' },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
  ]
};
