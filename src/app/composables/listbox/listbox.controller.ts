import { OptionState } from "../option/option";
import { ListboxState } from "./listbox";

export class ListboxController<T extends OptionState> {
  constructor(readonly state: ListboxState<T>) {}

  onKeyDown(event: KeyboardEvent) {
    this.handleNavigation(event);
    if (this.state.selectionState.multiselectable()) {
      this.handleMultiSelection(event);
    } else {
      this.handleSingleSelection(event);
    }
  }

  handleNavigation(event: KeyboardEvent) {
    const upOrLeft = this.state.vertical() ? 'ArrowUp' : 'ArrowLeft';
    const downOrRight = this.state.vertical() ? 'ArrowDown' : 'ArrowRight';

    switch (event.key) {
      case downOrRight:
        this.state.navigationState.navigateNext();
        break;
      case upOrLeft:
        this.state.navigationState.navigatePrev();
        break;
      case 'Home':
        this.state.navigationState.navigateFirst();
        break;
      case 'End':
        this.state.navigationState.navigateLast();
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
    const upOrLeft = this.state.vertical() ? 'ArrowUp' : 'ArrowLeft';
    const downOrRight = this.state.vertical() ? 'ArrowDown' : 'ArrowRight';

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
      } else if (event.key === downOrRight || event.key === upOrLeft) {
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
        this.state.navigationState.navigateTo(index);
        this.state.selectionState.multiselectable()
          ? this.state.selectionState.toggle()
          : this.state.selectionState.select();
      }
    }
  }
}
