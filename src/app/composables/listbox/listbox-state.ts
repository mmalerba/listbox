import { Signal, WritableSignal } from '@angular/core';
import { FocusInputs, FocusState } from '../focus/focus-state';
import {
  ListNavigationInputs,
  ListNavigationState,
} from '../navigation/list-navigation-state';
import { OptionState } from '../option/option-state';
import { SelectionInputs, SelectionState } from '../selection/selection-state';
import { TypeAheadInputs, TypeAheadState } from '../typeahead/typeahead-state';
import type { Orientation } from '../types';
import { ListboxController, ListboxSelectionMode } from './listbox-controller';

export type ListboxInputs<T extends OptionState> = {
  orientation: Signal<Orientation>;
  selectionMode: Signal<ListboxSelectionMode>;
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
  readonly multiselection: Signal<boolean>;
  readonly activedescendant: Signal<string | null>;
  readonly orientation: Signal<Orientation>;
  readonly items: Signal<T[]>;
  readonly selectionMode: Signal<ListboxSelectionMode>;
  readonly currentIndex: WritableSignal<number>;

  private controller?: ListboxController<T> | null = null;

  constructor(inputs: ListboxInputs<T>) {
    this.focusState = new FocusState(inputs);
    this.typeaheadState = new TypeAheadState(inputs);
    this.selectionState = new SelectionState(inputs);
    this.navigationState = new ListNavigationState(inputs);

    this.orientation = inputs.orientation;
    this.tabindex = this.focusState.tabindex;
    this.multiselection = inputs.multiselection;
    this.activedescendant = this.focusState.activedescendant;
    this.currentIndex = inputs.currentIndex;
    this.items = inputs.items;
    this.selectionMode = inputs.selectionMode;
  }

  async getController() {
    if (!this.controller) {
      const { ListboxController } = await import('./listbox-controller');
      this.controller = new ListboxController(this);
    }
    return this.controller;
  }

  async handleKeydown(e: KeyboardEvent) {
    const controller = await this.getController();
    controller.handleKeydown(e);
  }

  async handleClick(e: MouseEvent) {
    const controller = await this.getController();
    controller.handleClick(e);
  }
}
