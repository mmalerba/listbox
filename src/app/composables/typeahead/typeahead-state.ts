import { Signal, signal, WritableSignal } from '@angular/core';
import type { TypeaheadController } from './typeahead-controller';

export interface TypeAheadItemInputs {
  readonly searchTerm: Signal<string>;
}

export interface TypeAheadInputs<T extends TypeAheadItemInputs> {
  readonly items: Signal<T[]>;
  readonly delay: Signal<number>;
  readonly matcher: Signal<RegExp>;
  readonly currentIndex: WritableSignal<number>;
}

export class TypeAheadState<T extends TypeAheadItemInputs> {
  readonly items: Signal<T[]>;
  readonly delay: Signal<number>;
  readonly matcher: Signal<RegExp>;
  readonly currentIndex: WritableSignal<number>;
  readonly query = signal('');

  private controller?: TypeaheadController<T>;

  constructor(inputs: TypeAheadInputs<T>) {
    this.items = inputs.items;
    this.delay = inputs.delay;
    this.matcher = inputs.matcher;
    this.currentIndex = inputs.currentIndex;
  }

  async getController() {
    if (!this.controller) {
      const { TypeaheadController } = await import('./typeahead-controller');
      this.controller = new TypeaheadController(this);
    }
    return this.controller;
  }
}
