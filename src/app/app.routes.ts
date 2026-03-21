import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { DynamicComponent } from './pages/dynamic/dynamic';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dynamic', component: DynamicComponent }
];
