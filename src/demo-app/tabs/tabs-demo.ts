import { Component } from '@angular/core';
import { Tab } from '../../ng-a11y/tab.directive';
import { Tablist } from '../../ng-a11y/tablist.directive';
import { Tabpanel } from '../../ng-a11y/tabpanel.directive';

@Component({
  selector: 'tabs-demo',
  standalone: true,
  imports: [Tablist, Tab, Tabpanel],
  templateUrl: 'tabs-demo.html',
  styleUrl: 'tabs-demo.css',
})
export default class TabsDemo {}
