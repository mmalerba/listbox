import { Directive, ElementRef, inject, input } from '@angular/core';
import { TabState } from '../primitives/composables/tabs/tab-state';
import { Tablist } from './tablist.directive';

@Directive({
  selector: '[tab]',
  exportAs: 'tab',
  standalone: true,
  host: {
    role: 'tab',
    '[attr.id]': 'state.id()',
    '[attr.tabindex]': 'state.tabindex()',
    '[attr.aria-disabled]': 'state.disabled()',
  },
})
export class Tab {
  readonly element: HTMLElement = inject(ElementRef).nativeElement;
  readonly tablist = inject(Tablist).state;
  readonly disabled = input(false);
  readonly state: TabState;

  constructor() {
    this.state = new TabState(this);
  }
}
