import { computed, Signal, WritableSignal } from '@angular/core';
import type { Navigation2DController } from './navigation-2d.controller';
import { RowCol } from '../grid/grid';

export interface Cell {
  index: Signal<RowCol>;
  rowindex: Signal<number>;
  colindex: Signal<number>;
  rowspan: Signal<number>;
  colspan: Signal<number>;
  disabled: Signal<boolean>;
}

export interface Navigation2DInputs<T extends Cell> {
  wrap: Signal<boolean>;
  cells: Signal<T[][]>;
  rowcount: Signal<number>;
  colcount: Signal<number>;
  skipDisabled: Signal<boolean>;
  currentIndex: WritableSignal<RowCol>;
}

export class Navigation2DState<T extends Cell> {
  wrap: Signal<boolean>;
  cells: Signal<T[][]>;
  skipDisabled: Signal<boolean>;
  currentIndex: WritableSignal<RowCol>;
  rowcount: Signal<number>;
  colcount: Signal<number>;

  currentCell = computed(() => this.getCell(this.currentIndex())!);

  private controller: Navigation2DController<T> | null = null;

  async getController() {
    if (this.controller === null) {
      const { Navigation2DController } = await import(
        './navigation-2d.controller'
      );
      this.controller = new Navigation2DController(this);
    }
    return this.controller;
  }

  constructor(inputs: Navigation2DInputs<T>) {
    this.wrap = inputs.wrap;
    this.cells = inputs.cells;
    this.skipDisabled = inputs.skipDisabled;
    this.currentIndex = inputs.currentIndex;
    this.rowcount = inputs.rowcount;
    this.colcount = inputs.colcount;
  }

  getCell(index: RowCol): T | void {
    for (const row of this.cells()) {
      for (const cell of row) {
        if (
          index.rowindex >= cell.rowindex() &&
          index.rowindex <= cell.rowindex() + cell.rowspan() - 1 &&
          index.colindex >= cell.colindex() &&
          index.colindex <= cell.colindex() + cell.colspan() - 1
        ) {
          return cell;
        }
      }
    }
  }

  async navigateTo(index: RowCol) {
    const controller = await this.getController();
    controller.navigateTo(index);
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
