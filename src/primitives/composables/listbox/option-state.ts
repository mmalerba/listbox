import { computed, Signal } from '@angular/core';
import { ListboxState } from './listbox-state';

export interface OptionInputs {
  readonly element: HTMLElement;
  readonly disabled: Signal<boolean>;
  readonly searchTerm: Signal<string>;
  readonly listbox: ListboxState<OptionState>;
}

// TODO: use cdk id generator.
let counter = -1;

export class OptionState {
  readonly element: HTMLElement;
  readonly disabled: Signal<boolean>;
  readonly searchTerm: Signal<string>;
  readonly listbox: ListboxState<OptionState>;

  readonly id = computed(() => `cdk-uuid-${counter++}`);
  readonly setsize = computed(
    () => this.listbox.navigationState.items().length
  );
  readonly posinset = computed(() =>
    this.listbox.navigationState
      .items()
      .findIndex((item) => item.id() === this.id())
  );
  readonly focused = computed(
    () => this.listbox.focusState.focusIndex() === this.posinset()
  );
  readonly active = computed(
    () => this.listbox.focusState.activeIndex() === this.posinset()
  );
  readonly selected = computed(() =>
    this.listbox.selectionState.selectedIndices().includes(this.posinset())
  );
  readonly tabindex = computed(() => (this.focused() ? 0 : -1));

  constructor(inputs: OptionInputs) {
    this.element = inputs.element;
    this.listbox = inputs.listbox;
    this.disabled = inputs.disabled;
    this.searchTerm = inputs.searchTerm;
  }
}
