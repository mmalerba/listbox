import { computed, contentChildren, Directive } from '@angular/core';
import { GridCell } from './gridcell.directive';

@Directive({
  selector: '[row]',
  exportAs: 'row',
  standalone: true,
  host: { role: 'row' },
})
export class Row {
  children = contentChildren(GridCell, { descendants: true });
  gridcells = computed(() => this.children().map(c => c.state));
}
