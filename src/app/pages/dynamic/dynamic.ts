import { Component, Type } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { RedComponent } from '../../dynamic-components/red/red';
import { BlueComponent } from '../../dynamic-components/blue/blue';
import { GreenComponent } from '../../dynamic-components/green/green';
import { YellowComponent } from '../../dynamic-components/yellow/yellow';

interface ColorItem {
  name: string;
  component: Type<unknown>;
}

@Component({
  selector: 'app-dynamic',
  templateUrl: './dynamic.html',
  styleUrl: './dynamic.scss',
  imports: [NgComponentOutlet]
})
export class DynamicComponent {
  available: ColorItem[] = [
    { name: 'Red', component: RedComponent },
    { name: 'Blue', component: BlueComponent },
    { name: 'Green', component: GreenComponent },
    { name: 'Yellow', component: YellowComponent },
  ];

  active: ColorItem[] = [];

  add(item: ColorItem): void {
    this.active.push(item);
    this.available = this.available.filter(c => c !== item);
  }

  remove(item: ColorItem): void {
    this.available.push(item);
    this.active = this.active.filter(c => c !== item);
  }
}
