import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-grid-row-col',
  templateUrl: './grid-row-col.component.html',
  styleUrls: ['./grid-row-col.component.scss'],
})
export class GridRowColComponent implements OnInit {
  @Input()
  row: string;
  @Output()
  rowChange = new EventEmitter();

  rowNumber: number;

  unit: string;

  constructor() {}

  ngOnInit() {
    const match = this.row.match(/(px|%)/);
    if (match && match.length > 0) {
      this.unit = match[0];
      this.rowNumber = parseInt(this.row.replace(this.unit, ''), 10);
    } else {
      this.unit = '';
    }
  }
  onRowChange(size: string) {
    this.row = size + this.unit;
    this.rowChange.emit(this.row);
  }
  unitChanged(unit: string) {
    this.unit = unit;
    if (this.unit === '') {
      this.onRowChange('auto');
    }
  }
}
