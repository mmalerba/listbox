import { computed, Signal, WritableSignal } from '@angular/core';
import type { GridCoordinate } from '../grid/grid';
import type { GridNavigationController } from './grid-navigation-controller';

export interface GridNavigationCellInputs {
  coordinate: Signal<GridCoordinate>;
  rowspan: Signal<number>;
  colspan: Signal<number>;
  disabled: Signal<boolean>;
}

export interface GridNavigationInputs<T extends GridNavigationCellInputs> {
  wrap: Signal<boolean>;
  cells: Signal<T[][]>;
  rowcount: Signal<number>;
  colcount: Signal<number>;
  skipDisabled: Signal<boolean>;
  currentGridCoordinate: WritableSignal<GridCoordinate>;
}

export class GridNavigationState<T extends GridNavigationCellInputs> {
  wrap: Signal<boolean>;
  cells: Signal<T[][]>;
  skipDisabled: Signal<boolean>;
  currentGridCoordinate: WritableSignal<GridCoordinate>;
  rowcount: Signal<number>;
  colcount: Signal<number>;

  currentCell = computed(() => this.getCellAt(this.currentGridCoordinate())!);

  private controller: GridNavigationController<T> | null = null;

  async getController() {
    if (this.controller === null) {
      const { GridNavigationController } = await import(
        './grid-navigation-controller'
      );
      this.controller = new GridNavigationController(this);
    }
    return this.controller;
  }

  constructor(inputs: GridNavigationInputs<T>) {
    this.wrap = inputs.wrap;
    this.cells = inputs.cells;
    this.skipDisabled = inputs.skipDisabled;
    this.currentGridCoordinate = inputs.currentGridCoordinate;
    this.rowcount = inputs.rowcount;
    this.colcount = inputs.colcount;
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

  async navigateTo(coordinate: GridCoordinate) {
    const controller = await this.getController();
    controller.navigateTo(coordinate);
  }

  async navigateRight() {
    const controller = await this.getController();
    controller.navigateRight();
  }

  async navigateLeft() {
    const controller = await this.getController();
    controller.navigateLeft();
  }

  async navigateDown() {
    const controller = await this.getController();
    controller.navigateDown();
  }

  async navigateUp() {
    const controller = await this.getController();
    controller.navigateUp();
  }
}
