import { computed } from '@angular/core';
import { KeyboardEventManager } from '../event-managers/keyboard-event-manager';
import { ModifierKey } from '../event-managers/shared';
import { ListNavigationController } from '../navigation/list-navigation-controller';
import { OptionState } from '../option/option';
import { SelectionController } from '../selection/selection-controller';
import { ListboxState } from './listbox';

export enum ListboxSelectionMode {
  Recommended,
  FollowFocus,
  Explicit,
}

export class ListboxController<T extends OptionState> {
  private navigationController: ListNavigationController<T>;
  private selectionController: SelectionController<T>;

  private readonly keydownManager = computed(() => {
    const previousKey =
      this.state.orientation() === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    const nextKey =
      this.state.orientation() === 'vertical' ? 'ArrowDown' : 'ArrowRight';
    if (this.state.multiselection()) {
      if (this.state.selectionMode() === ListboxSelectionMode.FollowFocus) {
        return this.getFollowFocusMultiSelectionKeydownManager(
          previousKey,
          nextKey
        );
      }
      return this.getExplicitMultiSelectionKeydownManager(previousKey, nextKey);
    } else {
      if (this.state.selectionMode() === ListboxSelectionMode.Explicit) {
        return this.getExplicitSingleSelectionKeydownManager(
          previousKey,
          nextKey
        );
      }
      return this.getFollowFocusSingleSelectionKeydownManager(
        previousKey,
        nextKey
      );
    }
  });

  constructor(readonly state: ListboxState<T>) {
    this.navigationController = new ListNavigationController(
      state.navigationState
    );
    this.selectionController = new SelectionController(state.selectionState);
  }

  onKeyDown(event: KeyboardEvent) {
    this.keydownManager().handle(event);
    this.state.typeaheadState.search(event.key);
  }

  onPointerDown(event: PointerEvent) {
    this.navigationController.handleClick(event);

    if (event.target instanceof HTMLElement) {
      const li = event.target.closest('li');

      if (li) {
        this.state.selectionState.multiselection()
          ? this.selectionController.toggle()
          : this.selectionController.select();
      }
    }
  }

  private getFollowFocusSingleSelectionKeydownManager(
    previousKey: string,
    nextKey: string
  ) {
    return new KeyboardEventManager()
      .on(previousKey, () => {
        this.navigationController.navigatePrevious();
        this.selectionController.select();
      })
      .on(nextKey, () => {
        this.navigationController.navigateNext();
        this.selectionController.select();
      })
      .on('Home', () => {
        this.navigationController.navigateFirst();
        this.selectionController.select();
      })
      .on('End', () => {
        this.navigationController.navigateLast();
        this.selectionController.select();
      });
  }

  private getExplicitSingleSelectionKeydownManager(
    previousKey: string,
    nextKey: string
  ) {
    return new KeyboardEventManager()
      .on(previousKey, () => {
        this.navigationController.navigatePrevious();
      })
      .on(nextKey, () => {
        this.navigationController.navigateNext();
      })
      .on('Home', () => {
        this.navigationController.navigateFirst();
      })
      .on('End', () => {
        this.navigationController.navigateLast();
      })
      .on(' ', () => {
        this.selectionController.select();
      });
  }

  private getExplicitMultiSelectionKeydownManager(
    previousKey: string,
    nextKey: string
  ) {
    return new KeyboardEventManager()
      .on(previousKey, () => {
        this.navigationController.navigatePrevious();
      })
      .on(nextKey, () => {
        this.navigationController.navigateNext();
      })
      .on('Home', () => {
        this.navigationController.navigateFirst();
      })
      .on('End', () => {
        this.navigationController.navigateLast();
      })
      .on(' ', () => {
        this.selectionController.toggle();
      })
      .on(ModifierKey.Shift, previousKey, () => {
        this.navigationController.navigatePrevious();
        this.selectionController.toggle();
      })
      .on(ModifierKey.Shift, nextKey, () => {
        this.navigationController.navigateNext();
        this.selectionController.toggle();
      })
      .on(ModifierKey.Shift, ' ', () => {
        this.selectionController.selectContiguousRange();
      })
      .on(ModifierKey.Ctrl | ModifierKey.Shift, 'Home', () => {
        this.selectionController.selectRange(this.state.currentIndex(), 0);
        this.navigationController.navigateFirst();
      })
      .on(ModifierKey.Ctrl | ModifierKey.Shift, 'End', () => {
        this.selectionController.selectRange(
          this.state.currentIndex(),
          this.state.items().length - 1
        );
        this.navigationController.navigateLast();
      })
      .on(ModifierKey.Ctrl, 'a', () => {
        this.selectionController.toggleAll();
      });
  }

  private getFollowFocusMultiSelectionKeydownManager(
    previousKey: string,
    nextKey: string
  ) {
    return new KeyboardEventManager()
      .on(previousKey, () => {
        this.navigationController.navigatePrevious();
        this.selectionController.deselectAll();
        this.selectionController.select();
      })
      .on(nextKey, () => {
        this.navigationController.navigateNext();
        this.selectionController.deselectAll();
        this.selectionController.select();
      })
      .on('Home', () => {
        this.navigationController.navigateFirst();
        this.selectionController.deselectAll();
        this.selectionController.select();
      })
      .on('End', () => {
        this.navigationController.navigateLast();
        this.selectionController.deselectAll();
        this.selectionController.select();
      })
      .on(ModifierKey.Shift, previousKey, () => {
        this.navigationController.navigatePrevious();
        this.selectionController.toggle();
      })
      .on(ModifierKey.Shift, nextKey, () => {
        this.navigationController.navigateNext();
        this.selectionController.toggle();
      })
      .on(ModifierKey.Ctrl, previousKey, () => {
        this.navigationController.navigatePrevious();
      })
      .on(ModifierKey.Ctrl, nextKey, () => {
        this.navigationController.navigateNext();
      })
      .on(ModifierKey.Ctrl, ' ', () => {
        this.selectionController.toggle();
      })
      .on(ModifierKey.Shift, ' ', () => {
        this.selectionController.selectContiguousRange();
      })
      .on(ModifierKey.Ctrl | ModifierKey.Shift, 'Home', () => {
        this.selectionController.selectRange(this.state.currentIndex(), 0);
        this.navigationController.navigateFirst();
      })
      .on(ModifierKey.Ctrl | ModifierKey.Shift, 'End', () => {
        this.selectionController.selectRange(
          this.state.currentIndex(),
          this.state.items().length - 1
        );
        this.navigationController.navigateLast();
      })
      .on(ModifierKey.Ctrl, 'a', () => {
        this.selectionController.toggleAll();
      });
  }
}
