import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
  Output,
  EventEmitter,
  TemplateRef,
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
  @Output()
  public curGrid = new EventEmitter<{ path: string; data: string[][] }>();
  @Input()
  public templates: { gdRow: typeof TemplateRef; gdCol: typeof TemplateRef };
  public schemas: Observable<Schema>[];
  public FieldTypes = FieldTypes;
  private curGridObj: { path: string; data: string[][] };

  constructor(private layoutSrv: DynamicLayoutService) {}

  ngOnInit() {
    console.log('data', this.data);
  }

  editGrid(schema: { path: string; data: string[][] }) {
    this.curGridObj = schema;
    this.curGrid.emit(schema);
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

  onSchemaLoad(schema: { path: string; data: string[][] }) {
    if (schema && this.curGridObj && schema.path === this.curGridObj.path) {
      if (schema !== this.curGridObj) {
        this.curGridObj = schema;
        this.curGrid.emit(this.curGridObj);
      }
    }
    return schema;
  }
}
