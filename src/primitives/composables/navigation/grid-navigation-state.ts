import { computed, Signal, WritableSignal } from '@angular/core';
import type { GridCoordinate } from '../grid/grid-state';
import type { GridNavigationController } from './grid-navigation-controller';

export interface GridNavigationCellInputs {
  readonly coordinate: Signal<GridCoordinate>;
  readonly rowspan: Signal<number>;
  readonly colspan: Signal<number>;
  readonly disabled: Signal<boolean>;
}

export interface GridNavigationInputs<T extends GridNavigationCellInputs> {
  readonly wrap: Signal<boolean>;
  readonly cells: Signal<T[][]>;
  readonly rowcount: Signal<number>;
  readonly colcount: Signal<number>;
  readonly skipDisabled: Signal<boolean>;
  readonly activeGridCoordinate: WritableSignal<GridCoordinate>;
}

export class GridNavigationState<T extends GridNavigationCellInputs> {
  readonly wrap: Signal<boolean>;
  readonly cells: Signal<T[][]>;
  readonly skipDisabled: Signal<boolean>;
  readonly activeGridCoordinate: WritableSignal<GridCoordinate>;
  readonly rowcount: Signal<number>;
  readonly colcount: Signal<number>;

  readonly activeCell = computed(() =>
    this.getCellAt(this.activeGridCoordinate()),
  );

  private controller?: GridNavigationController<T>;

  constructor(inputs: GridNavigationInputs<T>) {
    this.wrap = inputs.wrap;
    this.cells = inputs.cells;
    this.skipDisabled = inputs.skipDisabled;
    this.activeGridCoordinate = inputs.activeGridCoordinate;
    this.rowcount = inputs.rowcount;
    this.colcount = inputs.colcount;
  }

  async getController() {
    if (!this.controller) {
      const { GridNavigationController } = await import(
        './grid-navigation-controller'
      );
      this.controller = new GridNavigationController(this);
    }
    return this.controller;
  }

  getCellAt(coordinate: GridCoordinate): T | undefined {
    for (const row of this.cells()) {
      for (const cell of row) {
        const cellCoordinate = cell.coordinate();
        if (
          coordinate.row >= cellCoordinate.row &&
          coordinate.row <= cellCoordinate.row + cell.rowspan() - 1 &&
          coordinate.col >= cellCoordinate.col &&
          coordinate.col <= cellCoordinate.col + cell.colspan() - 1
        ) {
          return cell;
        }
      }
    }
    return undefined;
  }
}
