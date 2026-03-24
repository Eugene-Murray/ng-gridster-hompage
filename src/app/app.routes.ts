import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { DynamicComponent } from './pages/dynamic/dynamic';
import { FlickrComponent } from './pages/flickr/flickr';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dynamic', component: DynamicComponent },
  { path: 'flickr', component: FlickrComponent }
];
