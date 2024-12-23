import { Directive, ElementRef, inject, model } from '@angular/core';
import { OptionState } from '../primitives/composables/listbox/option-state';
import { Listbox } from './listbox.directive';

@Directive({
  selector: '[option]',
  exportAs: 'option',
  standalone: true,
  host: {
    role: 'option',
    '[attr.id]': 'composable.id()',
    '[attr.tabindex]': 'composable.tabindex()',
    '[attr.aria-setsize]': 'composable.setsize()',
    '[attr.aria-posinset]': 'composable.posinset()',
    '[attr.aria-selected]': 'composable.selected()',
    '[attr.aria-disabled]': 'composable.disabled()',
    '[class.active]': 'composable.active()',
  },
})
export class Option {
  searchTerm = model.required<string>();
  disabled = model<boolean>(false);
  listbox = inject(Listbox).state;

  element = inject(ElementRef).nativeElement;
  composable: OptionState;

  constructor() {
    this.composable = new OptionState(this);
  }
}
