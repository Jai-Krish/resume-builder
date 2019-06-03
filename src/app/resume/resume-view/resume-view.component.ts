import { Component, OnInit } from '@angular/core';
import { ResumeService } from '../resume.service';
import { DocumentReference } from '@angular/fire/firestore';
import { StepsCfg } from 'src/app/dynamic-layout/resizable-div/resizable-div.component';

@Component({
  selector: 'app-resume-view',
  templateUrl: './resume-view.component.html',
  styleUrls: ['./resume-view.component.scss'],
})
export class ResumeViewComponent implements OnInit {
  public basicInfo = {};
  public schemasRef: DocumentReference[];
  public data: { [key: string]: any };
  public steps: StepsCfg = {
    x: {
      grid: [20, 80, 150, 280],
      position: 1,
    },
    y: {
      grid: [30, 70, 80],
      position: 0,
    },
  };

  constructor(private resumeSrv: ResumeService) {}

  ngOnInit() {
    this.resumeSrv.getBasicInfo().subscribe(res => {
      this.basicInfo = res[0];
      this.data = res[0];
      console.log(this.data);
    });
    this.schemasRef = [this.resumeSrv.getSchemaRef()];
  }
}
