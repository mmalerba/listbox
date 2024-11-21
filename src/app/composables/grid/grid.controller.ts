import { GridNavigationController } from '../navigation/grid-navigation-controller';
import { GridState } from './grid';
import { GridCellState } from './gridcell';

export class GridController<T extends GridCellState> {
  private navigationController: GridNavigationController<T>;

  constructor(readonly state: GridState<T>) {
    this.navigationController = new GridNavigationController(
      state.navigationState
    );
  }

  onPointerDown(event: PointerEvent) {
    if (event.target instanceof HTMLElement) {
      const cellEl = event.target.closest('[role="gridcell"]');

      if (cellEl) {
        const cell = this.state.navigationState
          .cells()
          .flat()
          .find((i) => i.id() === cellEl.id)!;

        if (cell.disabled() && this.state.skipDisabled()) {
          return;
        }

        const widgetEl = event.target.closest('.widget');
        this.navigationController.navigateTo(cell.coordinate());

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

    const cell = this.state.currentCell();

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
    const cell = this.state.currentCell();

    if (cell.disabled() || cell.inWidgetMode()) {
      return;
    }

    if (cell.widgets().length) {
      cell.widgetIndex.set(0);
    }
  }

  onEscape() {
    this.state.currentCell().widgetIndex.set(-1);
  }

  onArrowRight() {
    if (
      !this.state.inWidgetMode() ||
      this.state.currentCell().autofocusWidget()
    ) {
      this.navigationController.navigateRight();
      return;
    }

    if (this.state.currentCell().hasNavigation()) {
      this.state.currentCell().navigateNext();
    }
  }

  onArrowLeft() {
    if (
      !this.state.inWidgetMode() ||
      this.state.currentCell().autofocusWidget()
    ) {
      this.navigationController.navigateLeft();
      return;
    }

    if (this.state.currentCell().hasNavigation()) {
      this.state.currentCell().navigatePrev();
    }
  }

  onArrowDown() {
    if (
      !this.state.inWidgetMode() ||
      this.state.currentCell().autofocusWidget()
    ) {
      this.navigationController.navigateDown();
      return;
    }

    if (this.state.currentCell().hasNavigation()) {
      this.state.currentCell().navigateNext();
    }
  }

  onArrowUp() {
    if (
      !this.state.inWidgetMode() ||
      this.state.currentCell().autofocusWidget()
    ) {
      this.navigationController.navigateUp();
      return;
    }

    if (this.state.currentCell().hasNavigation()) {
      this.state.currentCell().navigatePrev();
    }
  }
}
