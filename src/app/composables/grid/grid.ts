import { computed, linkedSignal, Signal, WritableSignal } from '@angular/core';
import { FocusState } from '../focus/focus-state';
import { GridNavigationState } from '../navigation/grid-navigation-state';
import type { GridController } from './grid.controller';
import { GridCellState } from './gridcell';

export interface GridCoordinate {
  row: number;
  col: number;
}

export interface GridInputs {
  wrap: Signal<boolean>;
  rovingFocus: Signal<boolean>;
  cells: Signal<GridCellState[][]>;
  skipDisabled: WritableSignal<boolean>;
  currentGridCoordinate: WritableSignal<GridCoordinate>;
}

export class GridState {
  wrap: Signal<boolean>;
  rovingFocus: Signal<boolean>;
  cells: Signal<GridCellState[][]>;
  skipDisabled: WritableSignal<boolean>;
  currentGridCoordinate: WritableSignal<GridCoordinate>;
  currentCell: Signal<GridCellState>;
  focusedCell: Signal<GridCellState | void>;
  activeCell: Signal<GridCellState | void>;
  items: Signal<GridCellState[]>;
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

  focusState: FocusState<GridCellState>;
  navigationState: GridNavigationState<GridCellState>;
  controller: GridController | null = null;

  constructor(inputs: GridInputs) {
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
    if (this.controller === null) {
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
