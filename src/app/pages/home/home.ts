import { Component, OnInit, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Gridster,
  GridsterItem,
  GridsterConfig,
  GridsterItemConfig,
  DisplayGrid,
  CompactType,
  GridType,
} from 'angular-gridster2';
import { BlueComponent } from '../../dynamic-components/blue/blue';
import { RedComponent } from '../../dynamic-components/red/red';
import { GreenComponent } from '../../dynamic-components/green/green';
import { YellowComponent } from '../../dynamic-components/yellow/yellow';

const STORAGE_KEY = 'home-gridster-layout';

export interface DashboardItem {
  gridItem: GridsterItemConfig;
  component: Type<unknown>;
  label: string;
  id: number;
}

const COMPONENT_MAP: Record<string, Type<unknown>> = {
  BlueComponent,
  RedComponent,
  GreenComponent,
  YellowComponent,
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Gridster, GridsterItem],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {
  options: GridsterConfig = {
    gridType: GridType.Fit,
    compactType: CompactType.None,
    displayGrid: DisplayGrid.OnDragAndResize,
    draggable: { enabled: true },
    resizable: { enabled: true },
    minCols: 4,
    maxCols: 4,
    minRows: 4,
    pushItems: true,
    itemChangeCallback: () => this.saveLayout(),
    itemResizeCallback: () => this.saveLayout(),
  };

  dashboardItems: DashboardItem[] = [];

  private nextId = 1;

  private readonly availableComponents: Array<{ label: string; type: Type<unknown>; key: string }> = [
    { label: 'Blue', type: BlueComponent, key: 'BlueComponent' },
    { label: 'Red', type: RedComponent, key: 'RedComponent' },
    { label: 'Green', type: GreenComponent, key: 'GreenComponent' },
    { label: 'Yellow', type: YellowComponent, key: 'YellowComponent' },
  ];

  get availableToAdd(): Array<{ label: string; type: Type<unknown>; key: string }> {
    return this.availableComponents;
  }

  ngOnInit(): void {
    this.loadLayout();
  }

  addWidget(key: string): void {
    const def = this.availableComponents.find((c) => c.key === key);
    if (!def) return;

    const col = this.dashboardItems.length % 4;
    const row = Math.floor(this.dashboardItems.length / 4);

    this.dashboardItems.push({
      id: this.nextId++,
      label: def.label,
      component: def.type,
      gridItem: { cols: 1, rows: 1, x: col, y: row },
    });
    this.saveLayout();
  }

  removeWidget(item: DashboardItem): void {
    this.dashboardItems = this.dashboardItems.filter((d) => d !== item);
    this.saveLayout();
  }

  clearLayout(): void {
    this.dashboardItems = [];
    localStorage.removeItem(STORAGE_KEY);
  }

  private saveLayout(): void {
    const serialised = this.dashboardItems.map((d) => ({
      id: d.id,
      label: d.label,
      key: this.keyForComponent(d.component),
      gridItem: { ...d.gridItem },
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialised));
  }

  private loadLayout(): void {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      this.loadDefaults();
      return;
    }
    try {
      const parsed: Array<{ id: number; label: string; key: string; gridItem: GridsterItemConfig }> =
        JSON.parse(raw);
      this.dashboardItems = parsed.map((p) => ({
        id: p.id,
        label: p.label,
        component: COMPONENT_MAP[p.key] ?? BlueComponent,
        gridItem: p.gridItem,
      }));
      this.nextId = Math.max(0, ...this.dashboardItems.map((d) => d.id)) + 1;
    } catch {
      this.loadDefaults();
    }
  }

  private loadDefaults(): void {
    this.dashboardItems = [
      { id: this.nextId++, label: 'Blue', component: BlueComponent, gridItem: { cols: 1, rows: 1, x: 0, y: 0 } },
      { id: this.nextId++, label: 'Red', component: RedComponent, gridItem: { cols: 1, rows: 1, x: 1, y: 0 } },
      { id: this.nextId++, label: 'Green', component: GreenComponent, gridItem: { cols: 1, rows: 1, x: 2, y: 0 } },
      { id: this.nextId++, label: 'Yellow', component: YellowComponent, gridItem: { cols: 1, rows: 1, x: 3, y: 0 } },
    ];
    this.saveLayout();
  }

  private keyForComponent(type: Type<unknown>): string {
    return this.availableComponents.find((c) => c.type === type)?.key ?? 'BlueComponent';
  }
}

