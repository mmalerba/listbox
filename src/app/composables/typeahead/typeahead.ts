import { Signal, signal, WritableSignal } from "@angular/core";
import type { TypeAheadController } from "./typeahead.controller";

export interface Item {
  searchTerm: Signal<string>;
}

export interface TypeAheadInputs<T extends Item> {
  items: Signal<T[]>;
  delay: Signal<number>;
  matcher: Signal<RegExp>;
  currentIndex: WritableSignal<number>;
}

export class TypeAheadState<T extends Item> {
  items: Signal<T[]>;
  delay: Signal<number>;
  matcher: Signal<RegExp>;
  currentIndex: WritableSignal<number>;

  timeout: any;
  query = signal('');

  private controller: TypeAheadController<T> | null = null;

  constructor(args: TypeAheadInputs<T>) {
    this.items = args.items;
    this.delay = args.delay;
    this.matcher = args.matcher;
    this.currentIndex = args.currentIndex;
  }

  async getController() {
    if (this.controller === null) {
      const { TypeAheadController } = await import('./typeahead.controller');
      this.controller = new TypeAheadController(this);
    }
    return this.controller;
  }

  async search(char: string) {
    const controller = await this.getController();
    return controller.search(char);
  }
}
