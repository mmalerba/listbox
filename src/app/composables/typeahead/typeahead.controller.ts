import { Item, TypeAheadState } from "./typeahead";

export class TypeAheadController<T extends Item> {
  constructor(readonly state: TypeAheadState<T>) {}

  search(char: string) {
    if (!this.isValid(char)) {
      return;
    }

    clearTimeout(this.state.timeout);

    this.state.query.update(str => str + char.toLowerCase());
    const startIndex = this.state.query().length === 1 ? this.state.currentIndex() + 1 : this.state.currentIndex();
    const index = findIndexFrom(this.state.items(), i => i.searchTerm().toLowerCase().startsWith(this.state.query()), startIndex);

    if (index !== -1) {
      this.state.currentIndex.set(index);
    }

    this.state.timeout = setTimeout(() => {
      this.state.query.set('');
    }, this.state.delay());
  }

  private isValid(char: string): boolean {
    if (char.length !== 1) {
      return false;
    }
  
    if (this.state.query().length > 0 && char === ' ') {
      return true;
    }
  
    if (/[a-zA-z0-9]/.test(char)) {
      return true;
    }
  
    if (this.state.matcher().test(char)) {
      return true;
    }
  
    return false;
  }
}

function findIndexFrom<T>(array: T[], predicate: (value: T, index: number, obj: T[]) => unknown, startIndex = 0): number {
  for (let i = startIndex; i < array.length; i++) {
    if (predicate(array[i], i, array)) {
      return i;
    }
  }

  for (let i = 0; i < startIndex; i++) {
    if (predicate(array[i], i, array)) {
      return i;
    }
  }

  return -1;
}
