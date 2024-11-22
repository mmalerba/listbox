import { computed, Signal, WritableSignal } from '@angular/core';
import { FocusState } from '../focus/focus-state';
import { ListNavigationState } from '../navigation/list-navigation-state';
import { GridCoordinate, GridState } from './grid-state';
import { WidgetState } from './widget-state';

export interface GridCellInputs {
  readonly element: HTMLElement;
  readonly grid: GridState<GridCellState>;
  readonly wrap: Signal<boolean>;
  readonly rowspan: Signal<number>;
  readonly colspan: Signal<number>;
  readonly disabled: Signal<boolean>;
  readonly widgets: Signal<WidgetState[]>;
  readonly widgetIndex: WritableSignal<number>;
}

// TODO: use cdk id generator.
let counter = -1;

export class GridCellState {
  readonly element: HTMLElement;
  readonly grid: GridState<GridCellState>;
  readonly wrap: Signal<boolean>;
  readonly rowspan: Signal<number>;
  readonly colspan: Signal<number>;
  readonly disabled: Signal<boolean>;
  readonly widgets: Signal<WidgetState[]>;
  readonly widgetIndex: WritableSignal<number>;

  readonly focusState: FocusState<WidgetState>;
  readonly navigationState: ListNavigationState<WidgetState>;

  readonly id = computed(() => `gridcell-${counter++}`);
  readonly coordinate = computed(() => getIndex(this.grid.cells(), this.id()));
  readonly tabindex = computed(() => (this.focused() ? 0 : -1));

  readonly inWidgetMode = computed(
    () => this.autofocusWidget() || this.widgetIndex() !== -1
  );

  readonly autofocusWidget = computed(() => {
    const widget = this.widgets().at(0);

    return (
      this.widgets().length === 1 &&
      !widget!.usesArrowKeys() &&
      !widget!.editable()
    );
  });

  readonly hasNavigation = computed(() => this.widgets().length > 1);
  readonly isCurrent = computed(() => this.grid.currentCell() === this);

  readonly active = computed(() => {
    return (
      !this.autofocusWidget() &&
      this.widgetIndex() === -1 &&
      this.grid.activeCell() === this
    );
  });

  readonly focused = computed(() => {
    return (
      !this.autofocusWidget() &&
      this.widgetIndex() === -1 &&
      this.grid.focusedCell() === this
    );
  });

  constructor(inputs: GridCellInputs) {
    this.element = inputs.element;
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

    this.navigationState = new ListNavigationState({
      ...inputs,
      items: this.widgets,
      currentIndex: this.widgetIndex,
      skipDisabled: this.grid.skipDisabled,
    });
  }
}

function getIndex(grid: GridCellState[][], id: string): GridCoordinate {
  const takenCells: GridCoordinate[] = [];

  const getNextCol = (row: number, col: number) => {
    for (let i = 0; i < takenCells.length; i++) {
      if (takenCells[i].row === row && takenCells[i].col === col) {
        col++;
        takenCells.slice(i--, 1);
      }
    }
    return col;
  };

  const markCellsAsTaken = (cell: GridCellState) => {
    const { row, col } = cell.coordinate();
    for (let i = row + 1; i < row + cell.rowspan(); i++) {
      for (let j = col; j < col + cell.colspan(); j++) {
        takenCells.push({ row: i, col: j });
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
        return { row: rowindex, col: colindex };
      }

      colindex += cell.colspan();

      if (cell.rowspan() > 1) {
        markCellsAsTaken(cell);
      }
    }
  }

  return { row: 0, col: 0 };
}
