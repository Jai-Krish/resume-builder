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

  saveGrid(gridAreas: string[][], path: string) {
    return this.db.doc(path).update({
      gridAreas: gridAreas.map(res => res.join(' ')),
    });
  }
}
