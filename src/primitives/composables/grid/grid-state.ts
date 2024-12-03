import { computed, linkedSignal, Signal, WritableSignal } from '@angular/core';
import { FocusState } from '../focus/focus-state';
import { GridNavigationState } from '../navigation/grid-navigation-state';
import type { GridController } from './grid-controller';
import { GridCellState } from './gridcell-state';

export interface GridCoordinate {
  row: number;
  col: number;
}

export interface GridInputs<T extends GridCellState> {
  readonly wrap: Signal<boolean>;
  readonly cells: Signal<T[][]>;
  readonly skipDisabled: Signal<boolean>;
  readonly currentGridCoordinate: WritableSignal<GridCoordinate>;
  readonly rovingFocus: Signal<boolean>;
}

export class GridState<T extends GridCellState> {
  readonly wrap: Signal<boolean>;
  readonly rovingFocus: Signal<boolean>;
  readonly cells: Signal<T[][]>;
  readonly skipDisabled: Signal<boolean>;
  readonly currentGridCoordinate: WritableSignal<GridCoordinate>;
  readonly currentCell: Signal<T>;
  readonly focusedCell: Signal<T | undefined>;
  readonly activeCell: Signal<T | undefined>;
  readonly items: Signal<T[]>;
  readonly currentIndex: WritableSignal<number>;

  readonly tabindex: Signal<number>;

  readonly inWidgetMode = computed(() => !!this.currentCell()?.inWidgetMode());

  readonly rowcount = computed(() => this.cells().length);

  readonly colcount = computed(() => {
    if (!this.cells().length) {
      return 0;
    }

    let colcount = 0;
    for (const cell of this.cells().at(0)!) {
      colcount += cell.colspan();
    }

    return colcount;
  });

  readonly focusState: FocusState<T>;
  readonly navigationState: GridNavigationState<T>;

  private controller?: GridController<T>;

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
      this.items().indexOf(this.currentCell()),
    );

    this.focusState = new FocusState({
      ...inputs,
      items: this.items,
      currentIndex: this.currentIndex,
    });

    this.tabindex = this.focusState.tabindex;
    this.focusedCell = computed(
      () => this.items()[this.focusState.focusIndex()],
    );
    this.activeCell = computed(
      () => this.items()[this.focusState.activeIndex()],
    );
  }

  async getController() {
    if (!this.controller) {
      const { GridController } = await import('./grid-controller');
      this.controller = new GridController(this);
    }
    return this.controller;
  }

  async handleKeydown(event: KeyboardEvent) {
    const controller = await this.getController();
    controller.handleKeydown(event);
  }

  async handleClick(event: MouseEvent) {
    const controller = await this.getController();
    controller.handleClick(event);
  }
}
