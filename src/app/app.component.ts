import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListboxSelectionMode } from './composables/listbox/listbox.controller';
import { StatesService } from './states.service';
import { Grid } from './ui-primitives/grid.directive';
import { GridCell } from './ui-primitives/gridcell.directive';
import { Listbox } from './ui-primitives/listbox.directive';
import { Option } from './ui-primitives/option.directive';
import { Row } from './ui-primitives/row.directive';
import { Widget } from './ui-primitives/widget.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    Grid,
    Row,
    GridCell,
    Widget,
    Listbox,
    Option,
    FormsModule,
    TitleCasePipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
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
