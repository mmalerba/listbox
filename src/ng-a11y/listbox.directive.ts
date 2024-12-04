import {
  computed,
  contentChildren,
  Directive,
  effect,
  ElementRef,
  inject,
  model,
} from '@angular/core';
import { ListboxSelectionMode } from '../primitives/composables/listbox/listbox-controller';
import { ListboxState } from '../primitives/composables/listbox/listbox-state';
import { Option } from './option.directive';

@Directive({
  selector: '[listbox]',
  exportAs: 'listbox',
  standalone: true,
  host: {
    role: 'listbox',
    '[attr.tabindex]': 'state.tabindex()',
    '[attr.aria-orientation]': 'state.orientation()',
    '[attr.aria-multiselection]': 'state.multiselection()',
    '[attr.aria-activedescendant]': 'state.activedescendant()',
    '(mouseenter)': 'state.getController()',
    '(keydown)': 'state.handleKeydown($event)',
    '(click)': 'state.handleClick($event)',
  },
})
export class Listbox {
  readonly element: HTMLElement = inject(ElementRef).nativeElement;

  readonly wrap = model.required<boolean>();
  readonly vertical = model.required<boolean>();
  readonly selectionMode = model.required<ListboxSelectionMode>();
  readonly rovingFocus = model.required<boolean>();
  readonly skipDisabled = model.required<boolean>();
  readonly multiselection = model.required<boolean>();

  // This is a demonstration of how we can rename properties
  // if their meaning becomes unclear after being forwarded.

  readonly typeaheadDelay = model.required<number>();
  readonly typeaheadMatcher = model.required<RegExp>();

  readonly delay = this.typeaheadDelay;
  readonly matcher = this.typeaheadMatcher;

  readonly activeIndex = model.required<number>();
  readonly selectedIndices = model.required<number[]>();

  readonly children = contentChildren(Option);
  readonly items = computed(() => this.children().map((c) => c.composable));
  readonly orientation = computed(() =>
    this.vertical() ? 'vertical' : 'horizontal',
  );

  readonly state = new ListboxState(this);

  constructor() {
    effect(() => this.state.syncFocus());
  }
}
