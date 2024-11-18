import { computed, signal } from '@angular/core';
import { Cell, Navigation2DState } from './navigation-2d';
import { RowCol } from '../grid/grid';

export class Navigation2DController<T extends Cell> {
  constructor(readonly state: Navigation2DState<T>) {}

  navigateTo({ rowindex, colindex }: RowCol): void {
    const item = this.state.cells()[rowindex][colindex];
    if (!item.disabled()) {
      this.state.currentIndex.set({ rowindex, colindex });
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

  private getRightIndex = (prevIndex: RowCol) => {
    const prevCell = this.state.getCell(prevIndex)!;
    const nextIndex = {
      rowindex: prevIndex.rowindex,
      colindex: Math.min(
        this.state.colcount() - 1,
        prevCell.colindex() + prevCell.colspan()
      ),
    };
    const nextCell = this.state.getCell(nextIndex)!;

    if (
      prevCell === nextCell &&
      this.state.wrap() &&
      prevIndex.rowindex !== this.state.rowcount() - 1
    ) {
      return this.getNextRowFirstCell(prevIndex);
    }

    return nextIndex;
  };

  private getLeftIndex = (prevIndex: RowCol) => {
    const prevCell = this.state.getCell(prevIndex)!;
    const nextIndex = {
      rowindex: prevIndex.rowindex,
      colindex: Math.max(0, prevCell.colindex() - 1),
    };
    const nextCell = this.state.getCell(nextIndex)!;

    if (
      prevCell === nextCell &&
      this.state.wrap() &&
      prevIndex.rowindex !== 0
    ) {
      return this.getPrevRowLastCell(prevIndex);
    }

    return {
      rowindex: nextIndex.rowindex,
      colindex: nextCell.colindex(),
    };
  };

  private getDownIndex = (prevIndex: RowCol) => {
    const prevCell = this.state.getCell(prevIndex)!;
    const nextIndex = {
      rowindex: Math.min(
        this.state.rowcount() - 1,
        prevCell.rowindex() + prevCell.rowspan()
      ),
      colindex: prevIndex.colindex,
    };
    const nextCell = this.state.getCell(nextIndex)!;

    if (
      prevCell === nextCell &&
      this.state.wrap() &&
      prevIndex.colindex !== this.state.colcount() - 1
    ) {
      return this.getNextColFirstCell(prevIndex);
    }

    return nextIndex;
  };

  private getUpIndex = (prevIndex: RowCol) => {
    const prevCell = this.state.getCell(prevIndex)!;
    const nextIndex = {
      rowindex: Math.max(0, prevCell.rowindex() - 1),
      colindex: prevIndex.colindex,
    };
    const nextCell = this.state.getCell(nextIndex)!;

    if (
      prevCell === nextCell &&
      this.state.wrap() &&
      prevIndex.colindex !== 0
    ) {
      return this.getPrevColLastCell(prevIndex);
    }

    return {
      rowindex: nextCell.rowindex(),
      colindex: nextIndex.colindex,
    };
  };

  private getPrevRowLastCell(index: RowCol) {
    return {
      colindex: this.state.colcount() - 1,
      rowindex: Math.max(0, index.rowindex - 1),
    };
  }

  private getNextRowFirstCell(index: RowCol) {
    return {
      colindex: 0,
      rowindex: Math.min(this.state.rowcount() - 1, index.rowindex + 1),
    };
  }

  private getNextColFirstCell(index: RowCol) {
    return {
      rowindex: 0,
      colindex: Math.min(this.state.colcount() - 1, index.colindex + 1),
    };
  }

  private getPrevColLastCell(index: RowCol) {
    return {
      rowindex: this.state.rowcount() - 1,
      colindex: Math.max(0, index.colindex - 1),
    };
  }

  private navigate(navigateFn: (i: RowCol) => RowCol): void {
    const prevIndex = signal(this.state.currentIndex());
    const nextIndex = signal(this.state.currentIndex());
    const origIndex = signal(this.state.currentIndex());

    const isLoop = computed(() => {
      return (
        this.state.wrap() &&
        nextIndex().rowindex === origIndex().rowindex &&
        nextIndex().colindex === origIndex().colindex
      );
    });

    const isRepeat = computed(() => {
      return (
        !this.state.wrap() &&
        nextIndex().rowindex === prevIndex().rowindex &&
        nextIndex().colindex === prevIndex().colindex
      );
    });

    const isDisabled = computed(() => {
      return (
        this.state.skipDisabled() && this.state.getCell(nextIndex())!.disabled()
      );
    });

    const shouldSkip = computed(() => {
      if (isDisabled()) {
        return true;
      }

      const origCell = this.state.getCell(origIndex());
      const nextCell = this.state.getCell(nextIndex());
      const isSame = origCell === nextCell;

      if (isSame) {
        return (
          origIndex().rowindex !== nextIndex().rowindex ||
          origIndex().colindex !== nextIndex().colindex
        );
      }

      return false;
    });

    do {
      prevIndex.set(nextIndex());
      nextIndex.update(navigateFn);
    } while (shouldSkip() && !isLoop() && !isRepeat());

    this.state.currentIndex.set(nextIndex());
  }
}
