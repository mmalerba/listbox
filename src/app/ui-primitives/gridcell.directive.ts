import {
  computed,
  contentChildren,
  Directive,
  effect,
  ElementRef,
  inject,
  model,
} from '@angular/core';
import { GridCellState } from '../composables/grid/gridcell';
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
    '[attr.aria-rowindex]': 'state.rowindex()',
    '[attr.aria-colindex]': 'state.colindex()',
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
  hostEl = inject(ElementRef).nativeElement;

  children = contentChildren(Widget, { descendants: true });
  widgets = computed(() => this.children().map((c) => c.state));

  constructor() {
    this.state = new GridCellState(this);

    effect(() => {
      if (this.state.focused()) {
        this.hostEl.focus();
      }

      if (this.state.active()) {
        this.hostEl.scrollIntoView({
          block: 'nearest',
        });
      }
    });
  }
}
