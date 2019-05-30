import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { DocumentReference, AngularFirestore } from '@angular/fire/firestore';
import { Schema } from './dynamic-layout';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DynamicLayoutService {
  public currentGridArea = new ReplaySubject<{
    path: string;
    data: string[][];
  }>(1);
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

  async saveGridAreas(path, gridAreas: string[][]) {
    await this.db.doc(path).update({
      gridAreas: gridAreas.map(res => res.join(' ')),
    });
    this.currentGridArea.next({ data: undefined, path: undefined });
  }
}
