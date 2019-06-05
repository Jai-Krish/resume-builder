import { Component, OnInit } from '@angular/core';
import { StepsCfg } from '../resizable-div/resizable-div.component';
import { DynamicLayoutService } from '../dynamic-layout.service';

@Component({
  selector: 'app-grid-edit2',
  templateUrl: './grid-edit2.component.html',
  styleUrls: ['./grid-edit2.component.scss'],
})
export class GridEdit2Component implements OnInit {
  multiple = 3;
  gridCol = [33, 33, 33].map(res => res * this.multiple);
  gridRow = [33, 33, 33].map(res => res * this.multiple);
  grid: string[][];
  path: string;
  res: {
    path: string;
    data: string[][];
  };
  colors = {};
  public stepsArr: StepsCfg[];

  constructor(private layoutSrv: DynamicLayoutService) {}

  ngOnInit() {
    this.layoutSrv.currentGridArea.subscribe(res => {
      if (res.path) {
        this.path = res.path;
        this.grid = res.data;
        this.stepsArr = this.createGridObj(
          this.grid,
          this.gridRow,
          this.gridCol
        );
      } else {
        this.path = undefined;
        this.grid = undefined;
        this.stepsArr = undefined;
      }
    });
  }

  onStepsChange() {
    const occupancyArray = Array(this.gridRow.length)
      .fill(undefined)
      .map(_ => Array(this.gridCol.length).fill('.'));
    for (const occupant of this.stepsArr) {
      for (let i = 0; i < occupant.y.count; i++) {
        for (let j = 0; j < occupant.x.count; j++) {
          occupancyArray[occupant.y.start + i][occupant.x.start + j] =
            occupant.label;
        }
      }
    }
    // To preserve the original object
    occupancyArray.forEach((element, i) => {
      this.grid[i] = element;
    });
  }

  canGrow(step: StepsCfg) {
    return (dir: number, axis: string) => {
      const t = step[axis];
      const emptyCoord = {
        x: {
          start: step.x.start,
          count: step.x.count,
        },
        y: {
          start: step.y.start,
          count: step.y.count,
        },
      };
      if (dir > 0) {
        emptyCoord[axis].start =
          emptyCoord[axis].start + emptyCoord[axis].count;
        emptyCoord[axis].count = 1;
      } else {
        emptyCoord[axis].start = emptyCoord[axis].start - 1;
        emptyCoord[axis].count = 1;
      }
      const targetBlock = this.grid[emptyCoord.y.start][emptyCoord.x.start];
      if (targetBlock && targetBlock !== '.') {
        return false;
      } else {
        if (axis === 'y' && emptyCoord.x.count > 1) {
          for (let i = 1; i < emptyCoord.x.count; i++) {
            const targetBlock2 = this.grid[emptyCoord.y.start][
              emptyCoord.x.start + i
            ];
            if (targetBlock2 && targetBlock2 !== '.') {
              return false;
            }
          }
        } else if (axis === 'x' && emptyCoord.y.count > 1) {
          for (let i = 1; i < emptyCoord.y.count; i++) {
            const targetBlock2 = this.grid[emptyCoord.y.start + i][
              emptyCoord.x.start
            ];
            if (targetBlock2 && targetBlock2 !== '.') {
              return false;
            }
          }
        }
      }
      return true;
    };
  }

  private createGridObj(
    gridArr: string[][],
    gridRow: number[],
    gridCol: number[]
  ): StepsCfg[] {
    const result = {};
    gridArr.forEach((labels, row) => {
      labels.forEach((label, col) => {
        if (label !== '.') {
          result[label] = result[label]
            ? result[label]
            : { label, x: { grid: gridCol }, y: { grid: gridRow } };
          const gridObj = result[label];
          if (gridObj.x.start === undefined) {
            gridObj.x.start = col;
            gridObj.x.count = 1;
            gridObj.y.start = row;
            gridObj.y.count = 1;
          } else {
            if (gridObj.y.start === row) {
              gridObj.x.count++;
            }
            if (gridObj.x.start === col) {
              gridObj.y.count++;
            }
          }
          this.colors[gridObj.label] = this.colors[gridObj.label]
            ? this.colors[gridObj.label]
            : Math.floor(Math.random() * 16777215).toString(16);
        }
      });
    });
    return Object.values(result);
  }

  saveGridAreas() {
    this.layoutSrv.saveGridAreas(this.path, this.grid);
  }
}
