import {
  computed,
  contentChildren,
  Directive,
  effect,
  ElementRef,
  inject,
  model,
} from '@angular/core';
import { TablistState } from '../primitives/composables/tabs/tablist-state';
import { Tab } from './tab.directive';

@Directive({
  selector: '[tablist]',
  exportAs: 'tablist',
  standalone: true,
  host: {
    role: 'tablist',
    '[attr.tabindex]': 'state.tabindex()',
    '(keydown)': 'state.handleKeydown($event)',
    '(click)': 'state.handleClick($event)',
  },
})
export class Tablist {
  readonly element: HTMLElement = inject(ElementRef).nativeElement;

  readonly activeIndex = model(0);
  readonly tabs = contentChildren(Tab);
  readonly state = new TablistState({
    ...this,
    rovingFocus: computed(() => true),
    items: computed(() => this.tabs().map((t) => t.state)),
  });
  readonly activeTab = this.state.activeTab;

  constructor() {
    effect(() => this.state.syncFocus());
  }
}
