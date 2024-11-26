import { TabState } from './tab-state';
import { TabpanelState } from './tabpanel-state';

export class TabpanelController<T extends TabState> {
  constructor(private readonly state: TabpanelState<T>) {}

  handleMutation(_mutations: MutationRecord[], _observer: MutationObserver) {
    // TODO: use interactivity checker.
    const interaciveEl = this.state.element.querySelector('[tabindex="0"]');
    this.state.tabindex.set(interaciveEl ? -1 : 0);
  }
}
