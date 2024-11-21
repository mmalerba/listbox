import { computed, contentChildren, Directive, model } from '@angular/core';
import { GridCoordinate, GridState } from '../composables/grid/grid';
import { Row } from './row.directive';

@Directive({
  selector: '[grid]',
  exportAs: 'grid',
  standalone: true,
  host: {
    role: 'grid',
    '[attr.aria-rowcount]': 'state.rowcount()',
    '[attr.aria-colcount]': 'state.colcount()',
    '(focusin)': 'state.load()',
    '(keydown)': 'state.onKeyDown($event)',
    '(pointerdown)': 'state.onPointerDown($event)',
  },
})
export class Grid {
  wrap = model<boolean>(false);
  rovingFocus = model<boolean>(true);
  skipDisabled = model<boolean>(false);
  currentGridCoordinate = model<GridCoordinate>({ row: 0, col: 0 });

  state: GridState;
  rows = contentChildren(Row, { descendants: true });
  cells = computed(() => this.rows().map((row) => row.gridcells()));

  constructor() {
    this.state = new GridState(this);
  }
}
