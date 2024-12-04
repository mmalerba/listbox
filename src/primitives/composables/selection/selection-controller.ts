import { SelectionItemInputs, SelectionState } from './selection-state';

// TODO: don't select disabled items.

export class SelectionController<T extends SelectionItemInputs> {
  constructor(private readonly state: SelectionState<T>) {}

  select() {
    const index = this.state.activeIndex();
    if (this.state.multiselection()) {
      this.setSelection([...this.state.selectedIndices(), index]);
    } else {
      this.setSelection([index]);
    }
    this.state.lastSelected.set(index);
  }

  deselect() {
    const index = this.state.activeIndex();
    this.setSelection(this.state.selectedIndices().filter((i) => i !== index));
    this.state.lastSelected.set(index);
  }

  toggle() {
    this.state.selectedIndices().includes(this.state.activeIndex())
      ? this.deselect()
      : this.select();
  }

  selectAll() {
    this.setSelection(this.state.items().map((_, i) => i));
    this.state.lastSelected.set(-1);
  }

  deselectAll() {
    this.setSelection([]);
    this.state.lastSelected.set(-1);
  }

  toggleAll() {
    if (this.state.selectedIndices().length === this.state.items().length) {
      this.deselectAll();
    } else {
      this.selectAll();
    }
  }

  selectContiguousRange() {
    this.selectRange(this.state.lastSelected(), this.state.activeIndex());
  }

  selectRange(fromIndex: number, toIndex: number) {
    const upper = Math.min(
      Math.max(fromIndex, toIndex),
      this.state.items().length - 1,
    );
    const lower = Math.max(Math.min(fromIndex, toIndex), 0);
    const range = Array.from(
      { length: upper - lower + 1 },
      (_, i) => lower + i,
    );
    this.setSelection([...this.state.selectedIndices(), ...range]);
    this.state.lastSelected.set(toIndex);
  }

  private setSelection(selection: number[]) {
    const newSelection = new Set(selection);
    const currentSelection = new Set(this.state.selectedIndices());
    if (!isSetEqual(newSelection, currentSelection)) {
      this.state.selectedIndices.set([...newSelection]);
    }
  }
}

function isSetEqual(s1: Set<number>, s2: Set<number>) {
  return s1.size === s2.size && [...s1].every((value) => s2.has(value));
}
