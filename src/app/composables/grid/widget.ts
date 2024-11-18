import { computed, Signal } from '@angular/core';
import { GridState } from './grid';
import { GridCellState } from './gridcell';

export interface WidgetInputs {
  grid: GridState;
  cell: GridCellState;
  disabled: Signal<boolean>;
  editable: Signal<boolean>;
  usesArrowKeys: Signal<boolean>;
}

let counter = -1;

export class WidgetState {
  grid: GridState;
  cell: GridCellState;
  disabled: Signal<boolean>;
  editable: Signal<boolean>;
  usesArrowKeys: Signal<boolean>;
  class = computed(() => 'widget');

  id = computed(() => `widget-${counter++}`);
  tabindex = computed(() => (this.focused() ? 0 : -1));

  index = computed(() => {
    return this.cell.widgets().findIndex((w) => {
      return w.id() === this.id();
    });
  });

  active = computed(() => {
    if (this.cell.isCurrent()) {
      return (
        this.cell.autofocusWidget() ||
        this.cell.focusState.activeIndex() === this.index()
      );
    }
    return false;
  });

  focused = computed(() => {
    if (this.cell.isCurrent()) {
      return (
        this.cell.autofocusWidget() ||
        this.cell.focusState.focusIndex() === this.index()
      );
    }
    return false;
  });

  constructor(inputs: WidgetInputs) {
    this.grid = inputs.grid;
    this.cell = inputs.cell;
    this.disabled = inputs.disabled;
    this.editable = inputs.editable;
    this.usesArrowKeys = inputs.usesArrowKeys;

    // TODO: If a cell is disabled the widgets inside of it should also be disabled.
  }
}
