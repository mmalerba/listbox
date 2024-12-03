import {
  computed,
  contentChildren,
  Directive,
  ElementRef,
  inject,
  model,
} from '@angular/core';
import { GridCellState } from '../primitives/composables/grid/gridcell-state';
import { Grid } from './grid.directive';
import { Widget } from './widget.directive';

@Directive({
  selector: '[gridcell]',
  exportAs: 'gridcell',
  standalone: true,
  host: {
    role: 'gridcell',
    '[attr.id]': 'state.id()',
    '[attr.rowspan]': 'state.rowspan()',
    '[attr.colspan]': 'state.colspan()',
    '[attr.aria-rowspan]': 'state.rowspan()',
    '[attr.aria-colspan]': 'state.colspan()',
    '[attr.aria-rowindex]': 'state.coordinate().row',
    '[attr.aria-colindex]': 'state.coordinate().col',
    '[attr.aria-disabled]': 'state.disabled()',
    '[tabindex]': 'state.tabindex()',
  },
})
export class GridCell {
  wrap = model<boolean>(true);
  rowspan = model<number>(1);
  colspan = model<number>(1);
  disabled = model<boolean>(false);
  widgetIndex = model<number>(-1);

  state: GridCellState;
  grid = inject(Grid).state;
  element = inject(ElementRef).nativeElement;

  children = contentChildren(Widget, { descendants: true });
  widgets = computed(() => this.children().map((c) => c.state));

  constructor() {
    this.state = new GridCellState(this);
  }
}
