import { computed } from '@angular/core';
import { KeyboardEventManager } from '../event-managers/keyboard-event-manager';
import {
  MouseButton,
  MouseEventManager,
} from '../event-managers/mouse-event-manager';
import {
  ListNavigationItemInputs,
  ListNavigationState,
} from './list-navigation-state';

export class ListNavigationController<T extends ListNavigationItemInputs> {
  private readonly keydownManager = computed(() => {
    const prevKey =
      this.state.orientation() === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    const nextKey =
      this.state.orientation() === 'vertical' ? 'ArrowDown' : 'ArrowRight';
    const manager = new KeyboardEventManager()
      .on(prevKey, () => this.navigatePrevious())
      .on(nextKey, () => this.navigateNext())
      .on('Home', () => this.navigateFirst())
      .on('End', () => this.navigateLast());
    return manager;
  });

  private readonly clickManager = new MouseEventManager().on(
    MouseButton.Main,
    (event) => {
      const index = this.state
        .items()
        .findIndex((i) => i.element.contains(event.target as Node));
      this.navigateTo(index);
    }
  );

  constructor(private readonly state: ListNavigationState<T>) {}

  handleKeydown(e: KeyboardEvent) {
    this.keydownManager().handle(e);
  }

  handleClick(e: MouseEvent) {
    this.clickManager.handle(e);
  }

  navigateTo(index: number): void {
    this.navigate(index, () => index);
  }

  navigatePrevious() {
    this.navigate(this.state.currentIndex(), this.getPreviousIndex);
  }

  navigateNext() {
    this.navigate(this.state.currentIndex(), this.getNextIndex);
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

    this.state.currentIndex.set(index);
  }
}
