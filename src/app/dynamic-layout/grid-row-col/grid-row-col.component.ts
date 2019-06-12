import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-grid-row-col',
  templateUrl: './grid-row-col.component.html',
  styleUrls: ['./grid-row-col.component.scss'],
})
export class GridRowColComponent implements OnInit, OnChanges {
  @Input()
  data: string;
  @Output()
  dataChange = new EventEmitter();
  @Output()
  add = new EventEmitter();
  @Output()
  remove = new EventEmitter();

  rowNumber: number;

  unit: string;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      const match = this.data.match(/(px|%)/);
      if (match && match.length > 0) {
        this.unit = match[0];
        this.rowNumber = parseInt(this.data.replace(this.unit, ''), 10);
      } else {
        this.unit = '';
      }
    }
  }

  onRowChange(size: string) {
    this.data = size + this.unit;
    this.dataChange.emit(this.data);
  }
  unitChanged(unit: string) {
    this.unit = unit;
    if (this.unit === '') {
      this.onRowChange('auto');
    }
  }
}
