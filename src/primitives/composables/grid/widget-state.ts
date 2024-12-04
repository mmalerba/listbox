import { computed, Signal } from '@angular/core';
import { GridState } from './grid-state';
import { GridCellState } from './gridcell-state';

export interface WidgetInputs {
  readonly element: HTMLElement;
  readonly grid: GridState<GridCellState>;
  readonly cell: GridCellState;
  readonly disabled: Signal<boolean>;
  readonly editable: Signal<boolean>;
  readonly usesArrowKeys: Signal<boolean>;
}

// TODO: use cdk id generator.
let counter = -1;

export class WidgetState {
  readonly element: HTMLElement;
  readonly grid: GridState<GridCellState>;
  readonly cell: GridCellState;
  readonly disabled: Signal<boolean>;
  readonly editable: Signal<boolean>;
  readonly usesArrowKeys: Signal<boolean>;
  readonly class = computed(() => 'widget');

  readonly id = computed(() => `widget-${counter++}`);
  readonly tabindex = computed(() =>
    this.grid.rovingFocus() && this.active() ? 0 : -1,
  );

  readonly index = computed(() => {
    return this.cell.widgets().findIndex((w) => {
      return w.id() === this.id();
    });
  });

  readonly active = computed(() => {
    if (this.cell.isCurrent()) {
      return (
        this.cell.autofocusWidget() ||
        this.cell.focusState.activeIndex() === this.index()
      );
    }
    return false;
  });

  constructor(inputs: WidgetInputs) {
    this.element = inputs.element;
    this.grid = inputs.grid;
    this.cell = inputs.cell;
    this.disabled = inputs.disabled;
    this.editable = inputs.editable;
    this.usesArrowKeys = inputs.usesArrowKeys;

    // TODO: If a cell is disabled the widgets inside of it should also be disabled.
  }
}
