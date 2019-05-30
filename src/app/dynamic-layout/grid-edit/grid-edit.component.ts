import { Component, OnInit } from '@angular/core';
import { DynamicLayoutService } from '../dynamic-layout.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-grid-edit',
  templateUrl: './grid-edit.component.html',
  styleUrls: ['./grid-edit.component.scss'],
})
export class GridEditComponent implements OnInit {
  public gridData: string[][];
  public path: string;
  constructor(private layoutSrv: DynamicLayoutService) {}

  ngOnInit() {
    this.layoutSrv.currentGridArea.subscribe(grid => {
      this.gridData = grid.data;
      this.path = grid.path;
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    console.log(this.gridData);
  }

  createListIdArray(count: number) {
    const result = [];
    for (let i = count - 1; i > -1; i--) {
      result.push(`list-${i}`);
    }
    return result;
  }

  saveGridAreas() {
    console.log('saveGridAreas', this.path, this.gridData);
    this.layoutSrv.saveGridAreas(this.path, this.gridData);
  }
}
