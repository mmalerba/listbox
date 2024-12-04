import { Directive, ElementRef, inject, input } from '@angular/core';
import { TabState } from '../primitives/composables/tabs/tab-state';
import { TabpanelState } from '../primitives/composables/tabs/tabpanel-state';

@Directive({
  selector: '[tabpanel]',
  exportAs: 'tabpanel',
  standalone: true,
  host: {
    role: 'tabpanel',
    '[attr.tabindex]': 'state?.tabindex()',
  },
})
export class Tabpanel {
  readonly element: HTMLElement = inject(ElementRef).nativeElement;
  readonly for = input.required<TabState>();
  readonly state: TabpanelState<TabState>;
  private readonly mutationObserver: MutationObserver;

  constructor() {
    this.state = new TabpanelState({
      ...this,
      tab: this.for,
    });

    this.state.getController();

    this.mutationObserver = new MutationObserver((mutations, observer) =>
      this.state.handleMutation(mutations, observer),
    );

    this.mutationObserver.observe(this.element, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    });
  }
}
