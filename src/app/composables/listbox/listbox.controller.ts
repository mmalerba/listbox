import { computed } from '@angular/core';
import { ListNavigationController } from '../navigation/list-navigation-controller';
import { OptionState } from '../option/option';
import { ListboxState } from './listbox';

export class ListboxController<T extends OptionState> {
  private navigationController: ListNavigationController<T>;

  private previousKey = computed(() =>
    this.state.orientation() === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
  );
  private nextKey = computed(() =>
    this.state.orientation() === 'vertical' ? 'ArrowDown' : 'ArrowRight'
  );

  constructor(readonly state: ListboxState<T>) {
    this.navigationController = new ListNavigationController(
      state.navigationState
    );
  }

  onKeyDown(event: KeyboardEvent) {
    this.handleNavigation(event);
    if (this.state.selectionState.multiselectable()) {
      this.handleMultiSelection(event);
    } else {
      this.handleSingleSelection(event);
    }
  }

  handleNavigation(event: KeyboardEvent) {
    switch (event.key) {
      case this.nextKey():
        this.navigationController.navigateNext();
        break;
      case this.previousKey():
        this.navigationController.navigatePrev();
        break;
      case 'Home':
        this.navigationController.navigateFirst();
        break;
      case 'End':
        this.navigationController.navigateLast();
        break;
    }

    this.state.typeaheadState.search(event.key);
  }

  handleSingleSelection(event: KeyboardEvent) {
    if (this.state.selectionState.followFocus()) {
      this.state.selectionState.select();
      return;
    }

    if (event.key === ' ') {
      this.state.selectionState.toggle();
    }
  }

  handleMultiSelection(event: KeyboardEvent) {
    if (event.ctrlKey) {
      if (event.key === 'a') {
        this.state.selectionState.toggleAll();
        return;
      }
    }

    if (event.ctrlKey && event.shiftKey) {
      if (event.key === 'Home' || event.key === 'End') {
        this.state.selectionState.selectFromAnchor();
        return;
      }
    }

    if (event.shiftKey) {
      if (event.key === ' ') {
        this.state.selectionState.selectFromAnchor();
        return;
      } else if (
        event.key === this.nextKey() ||
        event.key === this.previousKey()
      ) {
        this.state.selectionState.toggle();
        return;
      }
    }

    if (event.key === ' ') {
      this.state.selectionState.toggle();
    }
  }

  onPointerDown(event: PointerEvent) {
    if (event.target instanceof HTMLElement) {
      const li = event.target.closest('li');

      if (li) {
        const index = this.state.navigationState
          .items()
          .findIndex((i) => i.id() === li.id);
        this.navigationController.navigateTo(index);
        this.state.selectionState.multiselectable()
          ? this.state.selectionState.toggle()
          : this.state.selectionState.select();
      }
    }
  }
}
