import { computed, Signal, WritableSignal } from '@angular/core';
import { FocusState } from '../focus/focus-state';
import { ListNavigationState } from '../navigation/list-navigation-state';
import { TabState } from './tab-state';
import type { TablistController } from './tablist-controller';

export interface TablistInputs<T extends TabState> {
  readonly items: Signal<T[]>;
  readonly rovingFocus: Signal<boolean>;
  readonly currentIndex: WritableSignal<number>;
}

export class TablistState<T extends TabState> {
  readonly focusState: FocusState<T>;
  readonly navigationState: ListNavigationState<T>;
  readonly items: Signal<T[]>;

  readonly tabindex = computed(() => this.focusState.tabindex());
  readonly currentTab = computed(
    () => this.items()[this.focusState.focusIndex()]
  );

  private controller?: TablistController<T>;

  constructor(inputs: TablistInputs<T>) {
    this.focusState = new FocusState(inputs);
    this.navigationState = new ListNavigationState({
      ...inputs,
      wrap: computed(() => true),
      skipDisabled: computed(() => false),
    });

    this.items = inputs.items;
  }

  async getController() {
    if (!this.controller) {
      const { TablistController } = await import('./tablist-controller');
      this.controller = new TablistController(this);
    }
    return this.controller;
  }

  async handleKeydown(e: KeyboardEvent) {
    const controller = await this.getController();
    controller.handleKeydown(e);
  }

  async handleClick(e: MouseEvent) {
    const controller = await this.getController();
    controller.handleClick(e);
  }
}
