import { computed, Signal, WritableSignal } from "@angular/core";
import { GridCellState } from "./gridcell";
import { Focus2DState } from "../focus/focus-2d";
import { Navigation2DState } from "../navigation/navigation-2d";
import type { GridController } from "./grid.controller";

export interface RowCol {
  rowindex: number;
  colindex: number;
}

export interface GridInputs {
  wrap: Signal<boolean>;
  rovingFocus: Signal<boolean>;
  cells: Signal<GridCellState[][]>;
  skipDisabled: WritableSignal<boolean>;
  currentIndex: WritableSignal<RowCol>;
}

export class GridState {
  wrap: Signal<boolean>;
  rovingFocus: Signal<boolean>;
  cells: Signal<GridCellState[][]>;
  skipDisabled: WritableSignal<boolean>;
  currentIndex: WritableSignal<RowCol>;
  currentCell: Signal<GridCellState>;
  focusedCell: Signal<GridCellState | void>;
  activeCell: Signal<GridCellState | void>;

  tabindex: Signal<number>;

  inWidgetMode = computed(() => this.currentCell().inWidgetMode());

  rowcount = computed(() => this.cells().length);

  colcount = computed(() => {
    if (!this.cells().length) {
      return 0;
    }

    let colcount = 0;
    for (const cell of this.cells().at(0)!) {
      colcount += cell.colspan();
    }

    return colcount;
  });

  focusState: Focus2DState<GridCellState>;
  navigationState: Navigation2DState<GridCellState>;
  controller: GridController | null = null;

  constructor(inputs: GridInputs) {
    this.wrap = inputs.wrap;
    this.cells = inputs.cells;
    this.rovingFocus = inputs.rovingFocus;
    this.skipDisabled = inputs.skipDisabled;
    this.currentIndex = inputs.currentIndex;

    this.focusState = new Focus2DState(inputs);

    this.navigationState = new Navigation2DState({
      ...inputs,
      rowcount: this.rowcount,
      colcount: this.colcount,
    });

    this.tabindex = this.focusState.tabindex;
    this.currentCell = this.navigationState.currentCell;
    this.focusedCell = this.focusState.focusedCell;
    this.activeCell = this.focusState.activeCell;
  }

  private async getController() {
    if (this.controller === null) {
      const { GridController } = await import('./grid.controller');
      this.controller = new GridController(this);
    }
    return this.controller;
  }

  load() {
    this.getController();
    this.currentCell().load();
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
