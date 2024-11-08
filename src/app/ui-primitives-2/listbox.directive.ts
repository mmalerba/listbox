import {
  computed,
  contentChildren,
  Directive,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { ListboxComposable } from '../composables-2/listbox';
import { Option } from './option.directive';

@Directive({
  selector: '[bindListboxState]',
  standalone: true,
  host: {
    role: 'listbox',
    '[attr.tabindex]': 'computedState.tabindex()',
    '[attr.aria-orientation]': 'computedState.orientation()',
    '[attr.aria-multiselectable]': 'computedState.multiselectable()',
    '[attr.aria-activedescendant]': 'computedState.activedescendant()',
    '(keydown)': 'computedState.onKeyDown($event)',
    '(pointerdown)': 'computedState.onPointerDown($event)',
  },
})
export class ListboxStateBinder {
  // allow state to come from input or host directvie (via signal).
  stateInput = input<ListboxComposable<any> | undefined>(undefined, {
    alias: 'bindListboxState',
  });
  state = signal<ListboxComposable<any> | undefined>(undefined);
  computedState = computed(() => this.stateInput() ?? this.state());
}

export function bindListboxStateToHost(state: ListboxComposable<any>) {
  inject(ListboxStateBinder, { self: true }).state.set(state);
}

@Directive({
  selector: '[listbox]',
  exportAs: 'listbox',
  standalone: true,
  hostDirectives: [ListboxStateBinder],
})
export class Listbox {
  wrap = model.required<boolean>();
  vertical = model.required<boolean>();
  followFocus = model.required<boolean>();
  rovingFocus = model.required<boolean>();
  skipDisabled = model.required<boolean>();
  multiselectable = model.required<boolean>();

  // This is a demonstration of how we can rename properties
  // if their meaning becomes unclear after being forwarded.

  typeaheadDelay = model.required<number>();
  typeaheadMatcher = model.required<RegExp>();

  delay = this.typeaheadDelay;
  matcher = this.typeaheadMatcher;

  currentIndex = model.required<number>();
  selectedIndices = model.required<number[]>();

  children = contentChildren(Option);
  items = computed(() => this.children().map((c) => c.composable));

  constructor() {
    bindListboxStateToHost(new ListboxComposable(this));
  }
}
