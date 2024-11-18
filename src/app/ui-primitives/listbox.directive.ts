import { computed, contentChildren, Directive, model } from '@angular/core';
import { ListboxState } from '../composables/listbox/listbox';
import { OptionState } from '../composables/option/option';
import { Option } from './option.directive';

@Directive({
  selector: '[listbox]',
  exportAs: 'listbox',
  standalone: true,
  host: {
    role: 'listbox',
    '[attr.tabindex]': 'state.tabindex()',
    '[attr.aria-orientation]': 'state.orientation()',
    '[attr.aria-multiselectable]': 'state.multiselectable()',
    '[attr.aria-activedescendant]': 'state.activedescendant()',
    '(focusin)': 'state.load()',
    '(mouseenter)': 'state.load()',
    '(keydown)': 'state.onKeyDown($event)',
    '(pointerdown)': 'state.onPointerDown($event)',
  },
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
  orientation = computed(() => (this.vertical() ? 'vertical' : 'horizontal'));

  state: ListboxState<OptionState>;

  constructor() {
    this.state = new ListboxState(this);
  }
}
