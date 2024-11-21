import { computed } from '@angular/core';
import { KeyboardEventManager } from '../event-manager/keyboard-event-manager';
import {
  MouseButton,
  MouseEventManager,
} from '../event-manager/mouse-event-manager';
import { GridNavigationController } from '../navigation/grid-navigation-controller';
import { ListNavigationController } from '../navigation/list-navigation-controller';
import { GridState } from './grid-state';
import { GridCellState } from './gridcell-state';

export class GridController<T extends GridCellState> {
  private readonly navigationController: GridNavigationController<T>;
  private readonly currentCellNavigationController = computed(() =>
    this.state.currentCell().hasNavigation()
      ? new ListNavigationController(this.state.currentCell().navigationState)
      : null
  );

  private keydownManager = new KeyboardEventManager()
    .on('Enter', () => this.onEnter())
    .on('Escape', () => this.onEscape())
    .on('ArrowUp', () => this.onArrowUp())
    .on('ArrowDown', () => this.onArrowDown())
    .on('ArrowLeft', () => this.onArrowLeft())
    .on('ArrowRight', () => this.onArrowRight())
    .on(
      (key) => /^[a-zA-z0-9]$/.test(key),
      () => this.onAlphanumeric()
    );

  private readonly clickManager = new MouseEventManager().on(
    MouseButton.Main,
    (event) => {
      const cell = this.state
        .items()
        .find((c) => c.element.contains(event.target as Node));

      if (!cell || (cell.disabled() && this.state.skipDisabled())) {
        return false;
      }

      this.navigationController.navigateTo(cell.coordinate());

      const widget = cell
        .widgets()
        .find((w) => w.element.contains(event.target as Node));
      if (widget) {
        this.currentCellNavigationController()?.navigateTo(widget.index());
      }
      return true;
    }
  );

  constructor(readonly state: GridState<T>) {
    this.navigationController = new GridNavigationController(
      state.navigationState
    );
  }

  handleClick(event: MouseEvent) {
    this.clickManager.handle(event);
  }

  handleKeydown(event: KeyboardEvent) {
    this.keydownManager.handle(event);
  }

  // TODO: Allow other chars with regexp similar to TypeAhead.
  private onAlphanumeric() {
    const cell = this.state.currentCell();
    if (cell.inWidgetMode()) {
      return false;
    }

    const widgets = cell.widgets();
    const widget = widgets.at(0);
    if (widgets.length === 1 && widget!.editable()) {
      cell.widgetIndex.set(0);
    }
    return true;
  }

  private onEnter() {
    const cell = this.state.currentCell();

    if (cell.disabled() || cell.inWidgetMode()) {
      return false;
    }

    if (cell.widgets().length) {
      cell.widgetIndex.set(0);
    }
    return true;
  }

  private onEscape() {
    this.state.currentCell().widgetIndex.set(-1);
  }

  private onArrowRight() {
    if (
      !this.state.inWidgetMode() ||
      this.state.currentCell().autofocusWidget()
    ) {
      this.navigationController.navigateRight();
      return;
    }

    this.currentCellNavigationController()?.navigateNext();
  }

  private onArrowLeft() {
    if (
      !this.state.inWidgetMode() ||
      this.state.currentCell().autofocusWidget()
    ) {
      this.navigationController.navigateLeft();
      return;
    }

    this.currentCellNavigationController()?.navigatePrevious();
  }

  private onArrowDown() {
    if (
      !this.state.inWidgetMode() ||
      this.state.currentCell().autofocusWidget()
    ) {
      this.navigationController.navigateDown();
      return;
    }

    this.currentCellNavigationController()?.navigateNext();
  }

  private onArrowUp() {
    if (
      !this.state.inWidgetMode() ||
      this.state.currentCell().autofocusWidget()
    ) {
      this.navigationController.navigateUp();
      return;
    }

    this.currentCellNavigationController()?.navigatePrevious();
  }
}
