import { computed, Signal } from '@angular/core';
import { TablistState } from './tablist-state';

export interface TabInputs {
  readonly element: HTMLElement;
  readonly disabled: Signal<boolean>;
  readonly tablist: TablistState<TabState>;
}

// TODO: Use cdk id generator.
let counter = 0;

export class TabState {
  readonly element: HTMLElement;
  readonly tablist: TablistState<TabState>;
  readonly disabled: Signal<boolean>;
  readonly id = computed(() => `cdk-tab-${counter++}`);
  readonly index = computed(() =>
    this.tablist.navigationState
      .items()
      .findIndex((item) => item.id() === this.id()),
  );
  readonly active = computed(
    () => this.tablist.focusState.activeIndex() === this.index(),
  );
  readonly tabindex = computed(() =>
    this.tablist.rovingFocus() && this.active() ? 0 : -1,
  );

  constructor(inputs: TabInputs) {
    this.element = inputs.element;
    this.tablist = inputs.tablist;
    this.disabled = inputs.disabled;
  }
}
