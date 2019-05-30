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
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

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

  constructor(private db: AngularFirestore) {}

  ngOnInit() {
    console.log('data', this.data);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.schemaRefs) {
      this.schemas = this.schemaRefs.map(res =>
        this.db
          .doc<Schema>(res)
          .valueChanges()
          .pipe(
            map(schema => {
              schema.path = res.path;
              schema.id = res.id;
              return schema;
            })
          )
      );
    }
  }
}
