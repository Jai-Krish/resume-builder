import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ResumeService {
  constructor(private db: AngularFirestore) {}

  getBasicInfo() {
    return this.db.collection('basicInfo').valueChanges();
  }
}
