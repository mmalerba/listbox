import { NavigationState, NavigationInputs } from '../navigation/navigation';
import { SelectionState, SelectionInputs } from '../selection/selection';
import { FocusState, FocusInputs } from '../focus/focus';
import { computed, Signal } from '@angular/core';
import { TypeAheadState, TypeAheadInputs } from '../typeahead/typeahead';
import { OptionState } from '../option/option';
import { ListboxController } from './listbox.controller';

export type ListboxInputs<T extends OptionState> = {
  vertical: Signal<boolean>;
} & NavigationInputs<T> &
  TypeAheadInputs<T> &
  SelectionInputs<T> &
  FocusInputs<T>;

export class ListboxState<T extends OptionState> {
  focusState: FocusState<T>;
  typeaheadState: TypeAheadState<T>;
  selectionState: SelectionState<T>;
  navigationState: NavigationState<T>;

  orientation = computed(() => (this.vertical() ? 'vertical' : 'horizontal'));

  tabindex: Signal<number>;
  vertical: Signal<boolean>;
  multiselectable: Signal<boolean>;
  activedescendant: Signal<string>;

  controller: ListboxController<T> | null = null;

  constructor(args: ListboxInputs<T>) {
    this.focusState = new FocusState(args);
    this.typeaheadState = new TypeAheadState(args);
    this.selectionState = new SelectionState(args);
    this.navigationState = new NavigationState(args);

    this.vertical = args.vertical;
    this.tabindex = this.focusState.tabindex;
    this.multiselectable = args.multiselectable;
    this.activedescendant = this.focusState.activedescendant;
  }

  private async getController() {
    if (this.controller === null) {
      const { ListboxController } = await import('./listbox.controller');
      this.controller = new ListboxController(this);
    }
    return this.controller;
  }

  async load() {
    this.getController();
    this.typeaheadState.getController();
    this.selectionState.getController();
    this.navigationState.getController();
  }

  async onKeyDown(event: KeyboardEvent) {
    const controller = await this.getController();
    controller.onKeyDown(event);
  }

  async onPointerDown(event: PointerEvent) {
    const controller = await this.getController();
    controller.onPointerDown(event);
  }
}
