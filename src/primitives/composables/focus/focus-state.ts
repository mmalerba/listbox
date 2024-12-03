import { computed, Signal, WritableSignal } from '@angular/core';

export interface FocusItemInputs {
  readonly element: HTMLElement;
  readonly id: Signal<string>;
}

export interface FocusInputs<T extends FocusItemInputs> {
  readonly element: HTMLElement;
  readonly items: Signal<T[]>;
  readonly rovingFocus: Signal<boolean>;
  readonly currentIndex: WritableSignal<number>;
}

export class FocusState<T extends FocusItemInputs> {
  readonly element: HTMLElement;
  readonly items: Signal<T[]>;
  readonly rovingFocus: Signal<boolean>;
  readonly currentIndex: WritableSignal<number>;

  readonly focusIndex = computed(() =>
    this.rovingFocus() ? this.currentIndex() : -1,
  );
  readonly activeIndex = computed(() =>
    this.rovingFocus() ? -1 : this.currentIndex(),
  );
  readonly focusItem = computed<T | undefined>(
    () => this.items()[this.focusIndex()],
  );
  readonly activeItem = computed<T | undefined>(
    () => this.items()[this.activeIndex()],
  );
  readonly tabindex = computed(() => (this.rovingFocus() ? -1 : 0));
  readonly activedescendant = computed(() => this.activeItem()?.id() ?? null);

  constructor(inputs: FocusInputs<T>) {
    this.element = inputs.element;
    this.items = inputs.items;
    this.rovingFocus = inputs.rovingFocus;
    this.currentIndex = inputs.currentIndex;
  }

  syncFocus() {
    this.rovingFocus();
    this.activeItem();
    this.focusItem();

    if (!this.element.contains(document.activeElement)) {
      return;
    }

    if (this.rovingFocus()) {
      this.focusItem()?.element.focus();
    } else {
      this.element.focus();
      this.activeItem()?.element.scrollIntoView({
        block: 'nearest',
      });
    }
  }
}
