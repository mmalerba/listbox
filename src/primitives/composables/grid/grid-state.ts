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
  readonly element: HTMLElement;
  readonly wrap: Signal<boolean>;
  readonly cells: Signal<T[][]>;
  readonly skipDisabled: Signal<boolean>;
  readonly activeGridCoordinate: WritableSignal<GridCoordinate>;
  readonly rovingFocus: Signal<boolean>;
}

export class GridState<T extends GridCellState> {
  readonly wrap: Signal<boolean>;
  readonly rovingFocus: Signal<boolean>;
  readonly cells: Signal<T[][]>;
  readonly skipDisabled: Signal<boolean>;
  readonly activeGridCoordinate: WritableSignal<GridCoordinate>;
  readonly activeCell: Signal<T | undefined>;
  readonly items: Signal<T[]>;
  readonly activeIndex: WritableSignal<number>;

  readonly tabindex: Signal<number>;

  readonly inWidgetMode = computed(() => !!this.activeCell()?.inWidgetMode());

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
    this.activeGridCoordinate = inputs.activeGridCoordinate;

    this.navigationState = new GridNavigationState({
      ...inputs,
      rowcount: this.rowcount,
      colcount: this.colcount,
    });

    this.activeCell = this.navigationState.activeCell;

    this.items = computed(() => this.cells().flat());
    this.activeIndex = linkedSignal(() =>
      this.items().indexOf(this.activeCell()!),
    );

    this.focusState = new FocusState({
      ...inputs,
      items: this.items,
      activeIndex: this.activeIndex,
    });

    this.tabindex = this.focusState.tabindex;
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

  syncFocus() {
    this.focusState.syncFocus();
  }
}
