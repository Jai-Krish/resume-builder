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

  async addGrid(grid: Schema, schemaId: string, gridAreas: string[][]) {
    const schemasCollection = this.db.collection<Schema>('schemas');
    const ref = await schemasCollection.add(grid);
    const schemaChild = schemasCollection.doc(schemaId);
    const target = (await schemaChild.get().toPromise()).data();
    target.child.push(ref);
    return schemaChild.update({
      child: target.child,
      gridAreas: gridAreas.map(res => res.join(' ')),
    });
  }
}
