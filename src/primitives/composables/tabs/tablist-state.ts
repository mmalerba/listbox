import { computed, Signal, WritableSignal } from '@angular/core';
import { FocusState } from '../focus/focus-state';
import { ListNavigationState } from '../navigation/list-navigation-state';
import { TabState } from './tab-state';
import type { TablistController } from './tablist-controller';

export interface TablistInputs<T extends TabState> {
  readonly element: HTMLElement;
  readonly items: Signal<T[]>;
  readonly rovingFocus: Signal<boolean>;
  readonly activeIndex: WritableSignal<number>;
}

export class TablistState<T extends TabState> {
  readonly focusState: FocusState<T>;
  readonly navigationState: ListNavigationState<T>;
  readonly items: Signal<T[]>;
  readonly rovingFocus: Signal<boolean>;

  readonly tabindex = computed(() => this.focusState.tabindex());
  readonly activeTab = computed(() =>
    this.items().at(this.focusState.activeIndex()),
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
    this.rovingFocus = inputs.rovingFocus;
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

  syncFocus() {
    this.focusState.syncFocus();
  }
}
