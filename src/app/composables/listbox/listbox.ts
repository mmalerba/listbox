import { Signal } from '@angular/core';
import { FocusInputs, FocusState } from '../focus/focus';
import {
  ListNavigationInputs,
  ListNavigationState,
} from '../navigation/list-navigation-state';
import { OptionState } from '../option/option';
import { SelectionInputs, SelectionState } from '../selection/selection';
import { TypeAheadInputs, TypeAheadState } from '../typeahead/typeahead';
import type { Orientation } from '../types';
import { ListboxController } from './listbox.controller';

export type ListboxInputs<T extends OptionState> = {
  orientation: Signal<Orientation>;
} & ListNavigationInputs<T> &
  TypeAheadInputs<T> &
  SelectionInputs<T> &
  FocusInputs<T>;

export class ListboxState<T extends OptionState> {
  readonly focusState: FocusState<T>;
  readonly typeaheadState: TypeAheadState<T>;
  readonly selectionState: SelectionState<T>;
  readonly navigationState: ListNavigationState<T>;

  readonly tabindex: Signal<number>;
  readonly multiselectable: Signal<boolean>;
  readonly activedescendant: Signal<string>;
  readonly orientation: Signal<Orientation>;

  controller: ListboxController<T> | null = null;

  constructor(args: ListboxInputs<T>) {
    this.focusState = new FocusState(args);
    this.typeaheadState = new TypeAheadState(args);
    this.selectionState = new SelectionState(args);
    this.navigationState = new ListNavigationState(args);

    this.orientation = args.orientation;
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
