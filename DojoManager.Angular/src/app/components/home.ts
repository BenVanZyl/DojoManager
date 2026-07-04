import { Component } from '@angular/core';
import { Hero } from './hero';
import { About } from './about';
import { News } from './news';
import { Locations } from './locations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, About, News, Locations],
  template: `
    <app-hero></app-hero>
    <app-about></app-about>
    <app-news></app-news>
    <app-locations></app-locations>
  `,
})
export class Home {}
