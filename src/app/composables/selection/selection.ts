import { computed, Signal, signal, WritableSignal } from '@angular/core';
import type { SelectionController } from './selection.controller';

export interface Item {
  disabled: Signal<boolean>;
  selected: Signal<boolean>;
}

export interface SelectionInputs<T extends Item> {
  items: Signal<T[]>;
  followFocus: Signal<boolean>;
  multiselectable: Signal<boolean>;
  currentIndex: WritableSignal<number>;
  selectedIndices: WritableSignal<number[]>;
}

export class SelectionState<T extends Item> {
  items: Signal<T[]>;
  followFocus: Signal<boolean>;
  multiselectable: Signal<boolean>;
  currentIndex: WritableSignal<number>;
  selectedIndices: WritableSignal<number[]>;

  anchorIndex = signal(-1);
  selectedItems = computed(() =>
    this.selectedIndices().map((i) => this.items()[i]!)
  );

  private controller: SelectionController<T> | null = null;

  constructor(args: SelectionInputs<T>) {
    this.items = args.items;
    this.followFocus = args.followFocus;
    this.multiselectable = args.multiselectable;
    this.currentIndex = args.currentIndex;
    this.selectedIndices = args.selectedIndices;
  }

  async getController() {
    if (this.controller === null) {
      const { SelectionController } = await import('./selection.controller');
      this.controller = new SelectionController(this);
    }
    return this.controller;
  }

  async select() {
    const controller = await this.getController();
    return controller.select();
  }

  async deselect() {
    const controller = await this.getController();
    return controller.deselect();
  }

  async toggle() {
    const controller = await this.getController();
    return controller.toggle();
  }

  async selectAll() {
    const controller = await this.getController();
    return controller.selectAll();
  }

  async deselectAll() {
    const controller = await this.getController();
    return controller.deselectAll();
  }

  async toggleAll() {
    const controller = await this.getController();
    return controller.toggleAll();
  }

  async selectFromAnchor() {
    const controller = await this.getController();
    return controller.selectFromAnchor();
  }
}
