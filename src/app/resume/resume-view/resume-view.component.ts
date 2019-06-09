import { Component, OnInit } from '@angular/core';
import { ResumeService } from '../resume.service';
import { DocumentReference } from '@angular/fire/firestore';

@Component({
  selector: 'app-resume-view',
  templateUrl: './resume-view.component.html',
  styleUrls: ['./resume-view.component.scss'],
})
export class ResumeViewComponent implements OnInit {
  public basicInfo = {};
  public schemasRef: DocumentReference[];
  public currGrid;
  public zoom = 4;
  public data: { [key: string]: any };
  templates;

  constructor(private resumeSrv: ResumeService) {}

  ngOnInit() {
    this.resumeSrv.getBasicInfo().subscribe(res => {
      this.basicInfo = res[0];
      this.data = res[0];
      console.log(this.data);
    });
    this.schemasRef = [this.resumeSrv.getSchemaRef()];
  }

  saveGrid() {
    this.resumeSrv.saveGrid(this.currGrid);
  }
}
