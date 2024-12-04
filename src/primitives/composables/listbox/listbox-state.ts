import { Signal, WritableSignal } from '@angular/core';
import { FocusState } from '../focus/focus-state';
import { ListNavigationState } from '../navigation/list-navigation-state';
import { SelectionState } from '../selection/selection-state';
import { TypeAheadState } from '../typeahead/typeahead-state';
import type { Orientation } from '../types';
import { ListboxController, ListboxSelectionMode } from './listbox-controller';
import { OptionState } from './option-state';

export type ListboxInputs<T extends OptionState> = {
  readonly element: HTMLElement;
  readonly items: Signal<T[]>;
  readonly activeIndex: WritableSignal<number>;
  readonly rovingFocus: Signal<boolean>;
  readonly multiselection: Signal<boolean>;
  readonly skipDisabled: Signal<boolean>;
  readonly wrap: Signal<boolean>;
  readonly delay: Signal<number>;
  readonly matcher: Signal<RegExp>;
  readonly selectedIndices: WritableSignal<number[]>;
  readonly orientation: Signal<Orientation>;
  readonly selectionMode: Signal<ListboxSelectionMode>;
};

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
  readonly activeIndex: WritableSignal<number>;
  readonly rovingFocus: Signal<boolean>;

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
    this.activeIndex = inputs.activeIndex;
    this.items = inputs.items;
    this.selectionMode = inputs.selectionMode;
    this.rovingFocus = inputs.rovingFocus;
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

  syncFocus() {
    this.focusState.syncFocus();
  }
}
