import { computed, Signal, WritableSignal } from "@angular/core";

interface Item {
  id: Signal<string>;
}

export interface FocusInputs<T extends Item> {
  items: Signal<T[]>;
  rovingFocus: Signal<boolean>;
  currentIndex: WritableSignal<number>;
}

export class FocusState<T extends Item> {
  items: Signal<T[]>;
  rovingFocus: Signal<boolean>;
  currentIndex: WritableSignal<number>;

  focusIndex = computed(() => (this.rovingFocus() ? this.currentIndex() : -1));
  activeIndex = computed(() => (this.rovingFocus() ? -1 : this.currentIndex()));
  focusItem = computed(() => this.items()[this.focusIndex()]);
  activeItem = computed(() => this.items()[this.activeIndex()]);
  tabindex = computed(() => (this.rovingFocus() ? -1 : 0));
  activedescendant = computed(() => this.activeItem()?.id() ?? null);

  constructor(args: FocusInputs<T>) {
    this.items = args.items;
    this.rovingFocus = args.rovingFocus;
    this.currentIndex = args.currentIndex;
  }
}
