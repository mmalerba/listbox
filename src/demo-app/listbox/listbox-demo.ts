import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Listbox } from '../../ng-a11y/listbox.directive';
import { Option } from '../../ng-a11y/option.directive';
import { ListboxSelectionMode } from '../../primitives/composables/listbox/listbox-controller';
import { StatesService } from '../states.service';

@Component({
  selector: 'listbox-demo',
  standalone: true,
  imports: [Listbox, Option, FormsModule, TitleCasePipe],
  templateUrl: 'listbox-demo.html',
  styleUrl: 'listbox-demo.css',
})
export default class ListboxDemo {
  service = inject(StatesService);
  states = this.service.getStates();

  wrap = true;
  vertical = true;
  rovingFocus = false;
  selectionModeStr = signal(`${ListboxSelectionMode.Recommended}`);
  selectionMode = computed(() => Number(this.selectionModeStr()));
  skipDisabled = true;
  multiselection = false;
  currentIndex = 0;
  typeaheadDelay = 600;
  selectedIndices = [0];
  typeaheadMatcher = /@/;
  ListboxSelectionMode = ListboxSelectionMode;
}
