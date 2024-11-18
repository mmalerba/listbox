import { computed, Signal, WritableSignal } from "@angular/core";
import type { NavigationController } from "./navigation.controller";

export interface Item {
  disabled: Signal<boolean>;
}

export interface NavigationInputs<T extends Item> {
  wrap: Signal<boolean>;
  items: Signal<T[]>;
  skipDisabled: Signal<boolean>;
  currentIndex: WritableSignal<number>;
}

export class NavigationState<T extends Item> {
  wrap: Signal<boolean>;
  items: Signal<T[]>;
  skipDisabled: Signal<boolean>;
  currentIndex: WritableSignal<number>;

  currentItem = computed(() => this.items()[this.currentIndex()]);

  firstIndex = computed(() => {
    if (!this.skipDisabled()) {
      return 0;
    }
    return this.items().findIndex((i) => !i.disabled()) ?? -1;
  });

  lastIndex = computed(() => {
    const items = this.items();

    if (!this.skipDisabled()) {
      return items.length - 1;
    }

    for (let i = items.length - 1; i >= 0; i--) {
      if (!items[i].disabled()) {
        return i;
      }
    }

    return -1;
  });

  private controller: NavigationController<T> | null = null;

  async getController() {
    if (this.controller === null) {
      const { NavigationController } = await import('./navigation.controller');
      this.controller = new NavigationController(this);
    }
    return this.controller;
  }

  constructor(args: NavigationInputs<T>) {
    this.wrap = args.wrap;
    this.items = args.items;
    this.skipDisabled = args.skipDisabled;
    this.currentIndex = args.currentIndex;
  }

  async navigateTo(index: number) {
    const controller = await this.getController();
    return controller.navigateTo(index);
  }

  async navigatePrev() {
    const controller = await this.getController();
    return controller.navigatePrev();
  }

  async navigateNext() {
    const controller = await this.getController();
    return controller.navigateNext();
  }

  async navigateFirst() {
    const controller = await this.getController();
    return controller.navigateFirst();
  }

  async navigateLast() {
    const controller = await this.getController();
    return controller.navigateLast();
  }

  async getPrevIndex(index: number) {
    const controller = await this.getController();
    return controller.getPrevIndex(index);
  }

  async getNextIndex(index: number) {
    const controller = await this.getController();
    return controller.getNextIndex(index);
  }
}
