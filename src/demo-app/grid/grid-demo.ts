import { Component } from '@angular/core';
import { Grid } from '../../ng-a11y/grid.directive';
import { GridCell } from '../../ng-a11y/gridcell.directive';
import { Row } from '../../ng-a11y/row.directive';
import { Widget } from '../../ng-a11y/widget.directive';

@Component({
  selector: 'grid-demo',
  standalone: true,
  imports: [Grid, Row, GridCell, Widget],
  templateUrl: 'grid-demo.html',
  styleUrl: 'grid-demo.css',
})
export default class GridDemo {}
