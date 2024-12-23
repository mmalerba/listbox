import {
  ListNavigationItemInputs,
  ListNavigationState,
} from './list-navigation-state';

export class ListNavigationController<T extends ListNavigationItemInputs> {
  constructor(private readonly state: ListNavigationState<T>) {}

  navigateTo(index: number): void {
    this.navigate(index, () => index);
  }

  navigatePrevious() {
    this.navigate(this.state.activeIndex(), this.getPreviousIndex);
  }

  navigateNext() {
    this.navigate(this.state.activeIndex(), this.getNextIndex);
  }

  navigateFirst() {
    this.navigate(-1, this.getNextIndex);
  }

  navigateLast() {
    this.navigate(-1, this.getPreviousIndex);
  }

  private getPreviousIndex = (index: number) => {
    index = index === -1 ? this.state.items().length : index;
    return this.state.wrap() && index === 0
      ? this.state.items().length - 1
      : index - 1;
  };

  private getNextIndex = (index: number) => {
    return this.state.wrap() && index === this.state.items().length - 1
      ? 0
      : index + 1;
  };

  private navigate(initial: number, navigateFn: (i: number) => number): void {
    const startIndex = navigateFn(initial);
    let index = startIndex;
    while (true) {
      // Don't navigate if we go past the end of the list.
      if (index < 0 || index >= this.state.items().length) {
        return;
      }
      // If we don't care about disabled state, or we land on a non-disabled item, stop and navigate
      // to it.
      if (!this.state.skipDisabled() || !this.state.items()[index].disabled()) {
        break;
      }

      index = navigateFn(index);

      // Don't navigate if we loop back around to our starting position.
      if (index === startIndex) {
        return;
      }
    }

    this.state.activeIndex.set(index);
  }
}
