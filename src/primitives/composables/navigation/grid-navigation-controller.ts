import { computed, signal } from '@angular/core';
import type { GridCoordinate } from '../grid/grid-state';
import {
  GridNavigationCellInputs,
  GridNavigationState,
} from './grid-navigation-state';

export class GridNavigationController<T extends GridNavigationCellInputs> {
  constructor(private readonly state: GridNavigationState<T>) {}

  navigateTo(coordinate: GridCoordinate): void {
    const item = this.state.getCellAt(coordinate);
    if (item && !item.disabled()) {
      this.state.currentGridCoordinate.set(coordinate);
    }
  }

  navigateRight() {
    this.navigate(this.getRightIndex);
  }

  navigateLeft() {
    this.navigate(this.getLeftIndex);
  }

  navigateDown() {
    this.navigate(this.getDownIndex);
  }

  navigateUp() {
    this.navigate(this.getUpIndex);
  }

  private getRightIndex = (prevIndex: GridCoordinate) => {
    const prevCell = this.state.getCellAt(prevIndex)!;
    const nextIndex = {
      row: prevIndex.row,
      col: Math.min(
        this.state.colcount() - 1,
        prevCell.coordinate().col + prevCell.colspan(),
      ),
    };
    const nextCell = this.state.getCellAt(nextIndex)!;

    if (
      prevCell === nextCell &&
      this.state.wrap() &&
      prevIndex.row !== this.state.rowcount() - 1
    ) {
      return this.getNextRowFirstCell(prevIndex);
    }

    return nextIndex;
  };

  private getLeftIndex = (prevIndex: GridCoordinate) => {
    const prevCell = this.state.getCellAt(prevIndex)!;
    const nextIndex = {
      row: prevIndex.row,
      col: Math.max(0, prevCell.coordinate().col - 1),
    };
    const nextCell = this.state.getCellAt(nextIndex)!;

    if (prevCell === nextCell && this.state.wrap() && prevIndex.row !== 0) {
      return this.getPrevRowLastCell(prevIndex);
    }

    return {
      row: nextIndex.row,
      col: nextCell.coordinate().col,
    };
  };

  private getDownIndex = (prevIndex: GridCoordinate) => {
    const prevCell = this.state.getCellAt(prevIndex)!;
    const nextIndex = {
      row: Math.min(
        this.state.rowcount() - 1,
        prevCell.coordinate().row + prevCell.rowspan(),
      ),
      col: prevIndex.col,
    };
    const nextCell = this.state.getCellAt(nextIndex)!;

    if (
      prevCell === nextCell &&
      this.state.wrap() &&
      prevIndex.col !== this.state.colcount() - 1
    ) {
      return this.getNextColFirstCell(prevIndex);
    }

    return nextIndex;
  };

  private getUpIndex = (prevIndex: GridCoordinate) => {
    const prevCell = this.state.getCellAt(prevIndex)!;
    const nextIndex = {
      row: Math.max(0, prevCell.coordinate().row - 1),
      col: prevIndex.col,
    };
    const nextCell = this.state.getCellAt(nextIndex)!;

    if (prevCell === nextCell && this.state.wrap() && prevIndex.col !== 0) {
      return this.getPrevColLastCell(prevIndex);
    }

    return {
      row: nextCell.coordinate().row,
      col: nextIndex.col,
    };
  };

  private getPrevRowLastCell(index: GridCoordinate) {
    return {
      col: this.state.colcount() - 1,
      row: Math.max(0, index.row - 1),
    };
  }

  private getNextRowFirstCell(index: GridCoordinate) {
    return {
      col: 0,
      row: Math.min(this.state.rowcount() - 1, index.row + 1),
    };
  }

  private getNextColFirstCell(index: GridCoordinate) {
    return {
      row: 0,
      col: Math.min(this.state.colcount() - 1, index.col + 1),
    };
  }

  private getPrevColLastCell(index: GridCoordinate) {
    return {
      row: this.state.rowcount() - 1,
      col: Math.max(0, index.col - 1),
    };
  }

  private navigate(navigateFn: (i: GridCoordinate) => GridCoordinate): void {
    const prevIndex = signal(this.state.currentGridCoordinate());
    const nextIndex = signal(this.state.currentGridCoordinate());
    const origIndex = signal(this.state.currentGridCoordinate());

    const isLoop = computed(() => {
      return (
        this.state.wrap() &&
        nextIndex().row === origIndex().row &&
        nextIndex().col === origIndex().col
      );
    });

    const isRepeat = computed(() => {
      return (
        !this.state.wrap() &&
        nextIndex().row === prevIndex().row &&
        nextIndex().col === prevIndex().col
      );
    });

    const isDisabled = computed(() => {
      return (
        this.state.skipDisabled() &&
        this.state.getCellAt(nextIndex())!.disabled()
      );
    });

    const shouldSkip = computed(() => {
      if (isDisabled()) {
        return true;
      }

      const origCell = this.state.getCellAt(origIndex());
      const nextCell = this.state.getCellAt(nextIndex());
      const isSame = origCell === nextCell;

      if (isSame) {
        return (
          origIndex().row !== nextIndex().row ||
          origIndex().col !== nextIndex().col
        );
      }

      return false;
    });

    do {
      prevIndex.set(nextIndex());
      nextIndex.update(navigateFn);
    } while (shouldSkip() && !isLoop() && !isRepeat());

    this.state.currentGridCoordinate.set(nextIndex());
  }
}
