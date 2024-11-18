import { computed, Signal, WritableSignal } from '@angular/core';
import { RowCol } from '../grid/grid';

export interface Cell {
  id: Signal<string>;
  index: Signal<RowCol>;
  rowindex: Signal<number>;
  colindex: Signal<number>;
  rowspan: Signal<number>;
  colspan: Signal<number>;
  disabled: Signal<boolean>;
}

export interface FocusInputs<T extends Cell> {
  cells: Signal<T[][]>;
  rovingFocus: Signal<boolean>;
  currentIndex: WritableSignal<RowCol>;
}

export class Focus2DState<T extends Cell> {
  cells: Signal<T[][]>;
  rovingFocus: Signal<boolean>;
  currentIndex: WritableSignal<RowCol>;

  focusIndex = computed(() =>
    this.rovingFocus() ? this.currentIndex() : { rowindex: -1, colindex: -1 }
  );

  activeIndex = computed(() =>
    this.rovingFocus() ? { rowindex: -1, colindex: -1 } : this.currentIndex()
  );

  focusedCell = computed(() => this.getCell(this.focusIndex()));
  activeCell = computed(() => this.getCell(this.activeIndex()));

  tabindex = computed(() => (this.rovingFocus() ? -1 : 0));
  activedescendant = computed(() => this.activeCell()?.id() ?? null);

  constructor(args: FocusInputs<T>) {
    this.cells = args.cells;
    this.rovingFocus = args.rovingFocus;
    this.currentIndex = args.currentIndex;
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
}
