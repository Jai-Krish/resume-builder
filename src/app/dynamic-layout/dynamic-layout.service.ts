import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { DocumentReference, AngularFirestore } from '@angular/fire/firestore';
import { Schema } from './dynamic-layout';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DynamicLayoutService {
  constructor(private db: AngularFirestore) {}

  getSchema(ref: DocumentReference): Observable<Schema> {
    return this.db
      .doc<Schema>(ref)
      .valueChanges()
      .pipe(
        map(schema => {
          schema.path = ref.path;
          schema.id = ref.id;
          if (schema.gridAreas) {
            schema.gridAreas = ((schema.gridAreas as any) as string[]).map(
              res => res.split(' ')
            );
          }
          return schema;
        })
      );
  }
}
