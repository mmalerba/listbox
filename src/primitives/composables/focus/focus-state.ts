import { computed, Signal, WritableSignal } from '@angular/core';

export interface FocusItemInputs {
  readonly element: HTMLElement;
  readonly id: Signal<string>;
}

export interface FocusInputs<T extends FocusItemInputs> {
  readonly element: HTMLElement;
  readonly items: Signal<T[]>;
  readonly rovingFocus: Signal<boolean>;
  readonly activeIndex: WritableSignal<number>;
}

export class FocusState<T extends FocusItemInputs> {
  readonly element: HTMLElement;
  readonly items: Signal<T[]>;
  readonly rovingFocus: Signal<boolean>;
  readonly activeIndex: WritableSignal<number>;
  readonly activeItem = computed<T | undefined>(
    () => this.items()[this.activeIndex()],
  );
  readonly tabindex = computed(() => (this.rovingFocus() ? -1 : 0));
  readonly activedescendant = computed(() => this.activeItem()?.id() ?? null);

  constructor(inputs: FocusInputs<T>) {
    this.element = inputs.element;
    this.items = inputs.items;
    this.rovingFocus = inputs.rovingFocus;
    this.activeIndex = inputs.activeIndex;
  }

  syncFocus() {
    this.rovingFocus();
    this.activeItem();

    if (!this.element.contains(document.activeElement)) {
      return;
    }

    if (this.rovingFocus()) {
      this.activeItem()?.element.focus();
    } else {
      this.element.focus();
      this.activeItem()?.element.scrollIntoView({
        block: 'nearest',
      });
    }
  }
}
