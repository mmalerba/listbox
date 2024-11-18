import { Signal } from '@angular/core';
import { GridState } from './grid';
import { GridCellState } from './gridcell';

export class GridController {
  inWidgetMode: Signal<boolean>;
  currentCell: Signal<GridCellState>;

  constructor(readonly state: GridState) {
    this.currentCell = this.state.currentCell;
    this.inWidgetMode = this.state.inWidgetMode;
  }

  onPointerDown(event: PointerEvent) {
    if (event.target instanceof HTMLElement) {
      const cellEl = event.target.closest('[role="gridcell"]');

      if (cellEl) {
        const cell = this.state.navigationState.cells().flat().find((i) => i.id() === cellEl.id)!;

        if (cell.disabled() && this.state.skipDisabled()) {
          return;
        }

        const widgetEl = event.target.closest('.widget');
        this.state.navigationState.navigateTo(cell.index());

        if (widgetEl) {
          const widget = cell.widgets().find((w) => w.id() === widgetEl.id)!;
          cell.navigateTo(widget.index());
        }
      }
    }
  }

  onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Enter':
        return this.onEnter();
      case 'Escape':
        return this.onEscape();
      case 'ArrowUp':
        return this.onArrowUp();
      case 'ArrowDown':
        return this.onArrowDown();
      case 'ArrowLeft':
        return this.onArrowLeft();
      case 'ArrowRight':
        return this.onArrowRight();
      default:
        return this.onAlphanumeric(event);
    }
  }

  // TODO: Allow other chars with regexp similar to TypeAhead.
  onAlphanumeric(event: KeyboardEvent) {
    if (event.key.length > 1) {
      return;
    }

    const cell = this.currentCell();

    if (cell.inWidgetMode()) {
      return;
    }

    if (/[a-zA-z0-9]/.test(event.key)) {
      const widgets = cell.widgets();
      const widget = widgets.at(0);
      if (widgets.length === 1 && widget!.editable()) {
        cell.widgetIndex.set(0);
      }
    }
  }

  onEnter() {
    const cell = this.currentCell();

    if (cell.disabled() || cell.inWidgetMode()) {
      return;
    }

    if (cell.widgets().length) {
      cell.widgetIndex.set(0);
    }
  }

  onEscape() {
    this.currentCell().widgetIndex.set(-1);
  }

  onArrowRight() {
    if (!this.inWidgetMode() || this.currentCell().autofocusWidget()) {
      this.state.navigationState.navigateRight();
      return;
    }

    if (this.currentCell().hasNavigation()) {
      this.currentCell().navigateNext();
    }
  }

  onArrowLeft() {
    if (!this.inWidgetMode() || this.currentCell().autofocusWidget()) {
      this.state.navigationState.navigateLeft();
      return;
    }

    if (this.currentCell().hasNavigation()) {
      this.currentCell().navigatePrev();
    }
  }

  onArrowDown() {
    if (!this.inWidgetMode() || this.currentCell().autofocusWidget()) {
      this.state.navigationState.navigateDown();
      return;
    }

    if (this.currentCell().hasNavigation()) {
      this.currentCell().navigateNext();
    }
  }

  onArrowUp() {
    if (!this.inWidgetMode() || this.currentCell().autofocusWidget()) {
      this.state.navigationState.navigateUp();
      return;
    }

    if (this.currentCell().hasNavigation()) {
      this.currentCell().navigatePrev();
    }
  }
}
