import { Item, SelectionState } from './selection';

export class SelectionController<T extends Item> {
  constructor(readonly state: SelectionState<T>) {}

  select() {
    this.state.anchorIndex.set(this.state.currentIndex());
    if (this.state.multiselectable()) {
      this.state.selectedIndices.update((arr) =>
        arr.concat([this.state.currentIndex()])
      );
    } else {
      this.state.selectedIndices.set([this.state.currentIndex()]);
    }
  }

  deselect() {
    this.state.selectedIndices.update((arr) =>
      arr.filter((i) => i !== this.state.currentIndex())
    );
  }

  toggle() {
    this.state.selectedIndices().includes(this.state.currentIndex())
      ? this.deselect()
      : this.select();
  }

  selectAll() {
    this.state.selectedIndices.set(this.state.items().map((v, i) => i));
  }

  deselectAll() {
    this.state.selectedIndices.set([]);
  }

  toggleAll() {
    if (this.state.selectedIndices().length === this.state.items().length) {
      this.deselectAll();
    } else {
      this.selectAll();
    }
  }

  selectFromAnchor() {
    if (this.state.anchorIndex() === -1) {
      return;
    }

    const upper = Math.max(this.state.currentIndex(), this.state.anchorIndex());
    const lower = Math.min(this.state.currentIndex(), this.state.anchorIndex());
    const range = Array.from(
      { length: upper - lower + 1 },
      (_, i) => lower + i
    );
    this.state.selectedIndices.update((arr) => arr.concat(range));
  }
}
