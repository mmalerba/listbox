import { computed, Signal, WritableSignal } from '@angular/core';
import { WidgetState } from './widget';
import { GridState, RowCol } from './grid';
import { NavigationState } from '../navigation/navigation';
import { FocusState } from '../focus/focus';

export interface GridCellInputs {
  grid: GridState;
  wrap: Signal<boolean>;
  rowspan: Signal<number>;
  colspan: Signal<number>;
  disabled: Signal<boolean>;
  widgets: Signal<WidgetState[]>;
  widgetIndex: WritableSignal<number>;
}

let counter = -1;

export class GridCellState {
  grid: GridState;
  wrap: Signal<boolean>;
  rowspan: Signal<number>;
  colspan: Signal<number>;
  disabled: Signal<boolean>;
  widgets: Signal<WidgetState[]>;
  widgetIndex: WritableSignal<number>;

  focusState: FocusState<WidgetState>;
  navigationState: NavigationState<WidgetState>;

  id = computed(() => `gridcell-${counter++}`);
  index = computed(() => getIndex(this.grid.cells(), this.id()));
  rowindex = computed(() => this.index().rowindex);
  colindex = computed(() => this.index().colindex);
  tabindex = computed(() => (this.focused() ? 0 : -1));

  inWidgetMode = computed(() => this.autofocusWidget() || this.widgetIndex() !== -1);

  autofocusWidget = computed(() => {
    const widget = this.widgets().at(0);

    return (
      this.widgets().length === 1 &&
      !widget!.usesArrowKeys() &&
      !widget!.editable()
    );
  });

  hasNavigation = computed(() => this.widgets().length > 1);
  isCurrent = computed(() => this.grid.currentCell() === this);

  active = computed(() => {
    return (
      !this.autofocusWidget() &&
      this.widgetIndex() === -1 &&
      this.grid.activeCell() === this
    );
  });

  focused = computed(() => {
    return (
      !this.autofocusWidget() &&
      this.widgetIndex() === -1 &&
      this.grid.focusedCell() === this
    );
  });

  constructor(inputs: GridCellInputs) {
    this.grid = inputs.grid;
    this.wrap = inputs.wrap;
    this.rowspan = inputs.rowspan;
    this.colspan = inputs.colspan;
    this.widgets = inputs.widgets;
    this.disabled = inputs.disabled;
    this.widgetIndex = inputs.widgetIndex;

    this.focusState = new FocusState({
      ...inputs,
      items: this.widgets,
      currentIndex: this.widgetIndex,
      rovingFocus: this.grid.rovingFocus,
    });

    this.navigationState = new NavigationState({
      ...inputs,
      items: this.widgets,
      currentIndex: this.widgetIndex,
      skipDisabled: this.grid.skipDisabled,
    });
  }

  load() {
    this.navigationState.getController();
  }

  navigateNext() {
    this.navigationState.navigateNext();
  }

  navigatePrev() {
    this.navigationState.navigatePrev();
  }

  navigateTo(index: number) {
    this.navigationState.navigateTo(index);
  }
}

function getIndex(grid: GridCellState[][], id: string): RowCol {
  const takenCells: RowCol[] = [];

  const getNextCol = (row: number, col: number) => {
    for (let i = 0; i < takenCells.length; i++) {
      if (takenCells[i].rowindex === row && takenCells[i].colindex === col) {
        col++;
        takenCells.slice(i--, 1);
      }
    }
    return col;
  };

  const markCellsAsTaken = (cell: GridCellState) => {
    for (
      let i = cell.rowindex() + 1;
      i < cell.rowindex() + cell.rowspan();
      i++
    ) {
      for (let j = cell.colindex(); j < cell.colindex() + cell.colspan(); j++) {
        takenCells.push({ rowindex: i, colindex: j });
      }
    }
  };

  let rowindex = 0;
  let colindex = 0;

  for (; rowindex < grid.length; rowindex++) {
    colindex = 0;
    const row = grid[rowindex];

    for (const cell of row) {
      colindex = getNextCol(rowindex, colindex);

      if (cell.id() === id) {
        return { rowindex: rowindex, colindex: colindex };
      }

      colindex += cell.colspan();

      if (cell.rowspan() > 1) {
        markCellsAsTaken(cell);
      }
    }
  }

  return { rowindex: 0, colindex: 0 };
}
