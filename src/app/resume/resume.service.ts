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

  async removeGrid(gridArea: string, schemaId: string, gridAreas: string[][]) {
    const schemaRef = this.db.doc(`schemas/${schemaId}`);
    const schema = (await schemaRef.get().toPromise()).data() as Schema;
    const childPromises = schema.child.map(ref => ref.get());
    const childSchemas = await Promise.all(childPromises);
    const batch = this.db.firestore.batch();
    for (let i = 0; i < childSchemas.length; i++) {
      const childSchema = childSchemas[i];
      if (childSchema.data().gridArea === gridArea) {
        batch.delete(this.db.doc(childSchema.ref.path).ref);
        schema.child.splice(i, 1);
        break;
      }
    }
    gridAreas.forEach((row, i) => {
      row.forEach((col, j) => {
        if (col === gridArea) {
          gridAreas[i][j] = '.';
        }
      });
    });
    batch.update(schemaRef.ref, {
      child: schema.child,
      gridAreas: gridAreas.map(res => res.join(' ')),
    });
    return batch.commit();
  }
}
