import { Component, OnInit } from '@angular/core';
import { ResumeService } from '../resume.service';
import { DocumentReference } from '@angular/fire/firestore';
import { FieldTypes, Schema } from '../../dynamic-layout/dynamic-layout';

@Component({
  selector: 'app-resume-view',
  templateUrl: './resume-view.component.html',
  styleUrls: ['./resume-view.component.scss'],
})
export class ResumeViewComponent implements OnInit {
  public basicInfo = {};
  public schemasRef: DocumentReference[];
  public currGrid: Schema;
  public zoom = 4;
  public data: { [key: string]: any };

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

  addGrid(coords: { x: number; y: number }) {
    const gridArea = this.makeId(5);
    const schema: Schema = {
      type: FieldTypes.text,
      field: prompt('Field name'),
      gridArea,
    };
    this.currGrid.gridAreas[coords.y][coords.x] = gridArea;
    this.resumeSrv.addGrid(schema, this.currGrid.id, this.currGrid.gridAreas);
  }

  private makeId(length: number) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
