import { computed, Signal, WritableSignal } from '@angular/core';
import type { ListNavigationController } from './list-navigation-controller';

export interface ListNavigationItemInputs {
  readonly element: HTMLElement;
  readonly disabled: Signal<boolean>;
}

export interface ListNavigationInputs<T extends ListNavigationItemInputs> {
  readonly wrap: Signal<boolean>;
  readonly items: Signal<T[]>;
  readonly skipDisabled: Signal<boolean>;
  readonly currentIndex: WritableSignal<number>;
}

export class ListNavigationState<T extends ListNavigationItemInputs> {
  readonly wrap: Signal<boolean>;
  readonly items: Signal<T[]>;
  readonly skipDisabled: Signal<boolean>;
  readonly currentIndex: WritableSignal<number>;

  readonly currentItem = computed(() => this.items()[this.currentIndex()]);

  private controller?: ListNavigationController<T>;

  constructor(inputs: ListNavigationInputs<T>) {
    this.wrap = inputs.wrap;
    this.items = inputs.items;
    this.skipDisabled = inputs.skipDisabled;
    this.currentIndex = inputs.currentIndex;
  }

  async getController() {
    if (!this.controller) {
      const { ListNavigationController } = await import(
        './list-navigation-controller'
      );
      this.controller = new ListNavigationController(this);
    }
    return this.controller;
  }
}
