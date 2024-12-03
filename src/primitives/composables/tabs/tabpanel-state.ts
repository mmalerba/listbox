import { computed, signal, Signal } from '@angular/core';
import { TabState } from './tab-state';
import type { TabpanelController } from './tabpanel-controller';

export interface TabpanelInputs<T extends TabState> {
  readonly element: HTMLElement;
  readonly tab: Signal<T>;
}

export class TabpanelState<T extends TabState> {
  readonly shown = computed(() => this.inputs.tab().focused());
  readonly tabindex = signal(0);
  readonly element: HTMLElement;

  private controller?: TabpanelController<T>;

  constructor(private inputs: TabpanelInputs<T>) {
    this.element = inputs.element;
  }

  async getController() {
    if (!this.controller) {
      const { TabpanelController } = await import('./tabpanel-controller');
      this.controller = new TabpanelController(this);
    }
    return this.controller;
  }

  async handleMutation(
    mutations: MutationRecord[],
    observer: MutationObserver,
  ) {
    const controller = await this.getController();
    controller.handleMutation(mutations, observer);
  }
}
