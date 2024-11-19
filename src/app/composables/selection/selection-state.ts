import { signal, Signal, WritableSignal } from '@angular/core';
import type { SelectionController } from './selection-controller';

export interface SelectionItemInputs {
  readonly disabled: Signal<boolean>;
  readonly selected: Signal<boolean>;
}

export interface SelectionInputs<T extends SelectionItemInputs> {
  readonly items: Signal<T[]>;
  readonly multiselection: Signal<boolean>;
  readonly currentIndex: WritableSignal<number>;
  readonly selectedIndices: WritableSignal<number[]>;
}

export class SelectionState<T extends SelectionItemInputs> {
  readonly items: Signal<T[]>;
  readonly multiselection: Signal<boolean>;
  readonly currentIndex: WritableSignal<number>;
  readonly selectedIndices: WritableSignal<number[]>;
  readonly lastSelected = signal(-1);

  private controller?: SelectionController<T>;

  constructor(inputs: SelectionInputs<T>) {
    this.items = inputs.items;
    this.multiselection = inputs.multiselection;
    this.currentIndex = inputs.currentIndex;
    this.selectedIndices = inputs.selectedIndices;
  }

  async getController() {
    if (!this.controller) {
      const { SelectionController } = await import('./selection-controller');
      this.controller = new SelectionController(this);
    }
    return this.controller;
  }
}
