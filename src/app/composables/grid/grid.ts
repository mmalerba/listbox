import { computed, linkedSignal, Signal, WritableSignal } from '@angular/core';
import { FocusInputs, FocusState } from '../focus/focus-state';
import {
  GridNavigationInputs,
  GridNavigationState,
} from '../navigation/grid-navigation-state';
import type { GridController } from './grid.controller';
import { GridCellState } from './gridcell';

export interface GridCoordinate {
  row: number;
  col: number;
}

export type GridInputs<T extends GridCellState> = GridNavigationInputs<T> &
  FocusInputs<T>;

export class GridState<T extends GridCellState> {
  wrap: Signal<boolean>;
  rovingFocus: Signal<boolean>;
  cells: Signal<T[][]>;
  skipDisabled: Signal<boolean>;
  currentGridCoordinate: WritableSignal<GridCoordinate>;
  currentCell: Signal<T>;
  focusedCell: Signal<T | undefined>;
  activeCell: Signal<T | undefined>;
  items: Signal<T[]>;
  currentIndex: WritableSignal<number>;

  tabindex: Signal<number>;

  inWidgetMode = computed(() => !!this.currentCell()?.inWidgetMode());

  rowcount = computed(() => this.cells().length);

  colcount = computed(() => {
    if (!this.cells().length) {
      return 0;
    }

    let colcount = 0;
    for (const cell of this.cells().at(0)!) {
      colcount += cell.colspan();
    }

    return colcount;
  });

  focusState: FocusState<T>;
  navigationState: GridNavigationState<T>;
  controller?: GridController<T>;

  constructor(inputs: GridInputs<T>) {
    this.wrap = inputs.wrap;
    this.cells = inputs.cells;
    this.rovingFocus = inputs.rovingFocus;
    this.skipDisabled = inputs.skipDisabled;
    this.currentGridCoordinate = inputs.currentGridCoordinate;

    this.navigationState = new GridNavigationState({
      ...inputs,
      rowcount: this.rowcount,
      colcount: this.colcount,
    });

    this.currentCell = this.navigationState.currentCell;

    this.items = computed(() => this.cells().flat());
    this.currentIndex = linkedSignal(() =>
      this.items().indexOf(this.currentCell())
    );

    this.focusState = new FocusState({
      ...inputs,
      items: this.items,
      currentIndex: this.currentIndex,
    });

    this.tabindex = this.focusState.tabindex;
    this.focusedCell = computed(
      () => this.items()[this.focusState.focusIndex()]
    );
    this.activeCell = computed(
      () => this.items()[this.focusState.activeIndex()]
    );
  }

  private async getController() {
    if (!this.controller) {
      const { GridController } = await import('./grid.controller');
      this.controller = new GridController(this);
    }
    return this.controller;
  }

  load() {
    this.getController();
    this.currentCell()?.load();
    this.navigationState.getController();
  }

  async onKeyDown(event: KeyboardEvent) {
    const controller = await this.getController();
    controller.onKeyDown(event);
  }

  async onPointerDown(event: PointerEvent) {
    const controller = await this.getController();
    controller.onPointerDown(event);
  }
}
