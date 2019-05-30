import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { Schema, FieldTypes } from '../dynamic-layout';
import { DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DynamicLayoutService } from '../dynamic-layout.service';

@Component({
  selector: '[app-content-block]',
  templateUrl: './content-block.component.html',
  styleUrls: ['./content-block.component.scss'],
})
export class ContentBlockComponent implements OnChanges, OnInit {
  @Input()
  private schemaRefs: DocumentReference[];
  @Input()
  public data: { [key: string]: any };
  public schemas: Observable<Schema>[];
  public FieldTypes = FieldTypes;

  constructor(private layoutSrv: DynamicLayoutService) {}

  ngOnInit() {
    console.log('data', this.data);
  }

  editGrid(path: string, grid: string[][]) {
    this.layoutSrv.currentGridArea.next({ path, data: grid });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.schemaRefs) {
      this.schemas = this.schemaRefs.map(res => this.layoutSrv.getSchema(res));
    }
  }

  formatGridAreas(grid: string[][]) {
    const colLength = grid.reduce(
      (acc, cur) => (cur.length > acc ? cur.length : acc),
      0
    );
    return grid
      .map(res => {
        if (res.length === colLength) {
          return res.join(' ');
        } else {
          const temp = [];
          for (let i = res.length; i < colLength; i++) {
            temp.push(res.length > 0 ? res[res.length - 1] : '.');
          }
          return [res.join(' '), temp.join(' ')].join(' ');
        }
      })
      .join(' | ');
  }
}
