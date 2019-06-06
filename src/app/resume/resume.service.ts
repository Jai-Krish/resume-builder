import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Schema } from '../dynamic-layout/dynamic-layout';

@Injectable({
  providedIn: 'root',
})
export class ResumeService {
  constructor(private db: AngularFirestore) {}

  getBasicInfo() {
    return this.db.collection('basicInfo').valueChanges();
  }

  getSchemaRef() {
    return this.db.doc<Schema>('/schemas/jbthsKOw7VqZhuu2SFKf').ref;
  }

  saveGrid(schema) {
    console.log(schema);
    return this.db.doc(schema.path).update({
      gridAreas: schema.gridAreas.map(res => res.join(' ')),
      gridRows: schema.gridRows,
      gridColumns: schema.gridColumns,
    });
  }
}
