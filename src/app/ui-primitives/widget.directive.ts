import { Directive, effect, ElementRef, inject, model } from '@angular/core';
import { WidgetState } from '../composables/grid/widget';
import { Grid } from './grid.directive';
import { GridCell } from './gridcell.directive';

@Directive({
  selector: '[widget]',
  standalone: true,
  host: {
    '[attr.id]': 'state.id()',
    '[attr.aria-disabled]': 'state.disabled()',
    '[tabindex]': 'state.tabindex()',
    '[class]': 'state.class()',
  },
})
export class Widget {
  state: WidgetState;
  grid = inject(Grid).state;
  cell = inject(GridCell).state;
  hostEl = inject(ElementRef).nativeElement;

  disabled = model<boolean>(false);
  editable = model<boolean>(false);
  usesArrowKeys = model<boolean>(false);

  constructor() {
    let isInitialLoad = true;
    this.state = new WidgetState(this);

    effect(() => {
      if (this.state.focused() && !isInitialLoad) {
        this.hostEl.focus();
      }

      if (this.state.active() && !isInitialLoad) {
        this.hostEl.scrollIntoView({
          block: 'nearest',
        });
      }

      isInitialLoad = false;
    });
  }
}
