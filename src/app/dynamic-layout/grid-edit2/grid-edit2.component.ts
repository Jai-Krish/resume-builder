import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { StepsCfg } from '../resizable-div/resizable-div.component';

@Component({
  selector: 'app-grid-edit2',
  templateUrl: './grid-edit2.component.html',
  styleUrls: ['./grid-edit2.component.scss'],
})
export class GridEdit2Component implements OnInit, OnChanges {
  @Input()
  zoom = 2;
  @Input()
  grid: string[][];
  @Input()
  grdRow: string[];
  @Input()
  grdCol: string[];
  @Output()
  gridChange = new EventEmitter<string[][]>();

  colors = {};
  stepsArr: StepsCfg[];
  emptyArr: StepsCfg[] = [];
  swapTarget: StepsCfg;

  private gridCol: number[];
  private gridRow: number[];
  private gridColZoomed: number[];
  private gridRowZoomed: number[];

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.grid) {
      if (!this.grid) {
        this.grid = undefined;
        this.stepsArr = undefined;
      }
    }
    if (changes.grdRow) {
      this.gridRow = this.grdRow
        ? Array(this.grdRow.length).fill(100 / this.grdRow.length)
        : [];
    }
    if (changes.grdCol) {
      this.gridCol = this.grdCol
        ? Array(this.grdCol.length).fill(100 / this.grdCol.length)
        : [];
    }

    this.gridRowZoomed = this.gridRow.map(res => res * this.zoom);
    this.gridColZoomed = this.gridCol.map(res => res * this.zoom);
    if (changes.grid || changes.grdRow || changes.grdCol || changes.zoom) {
      if (this.grid) {
        this.stepsArr = this.createGridObj(
          this.grid,
          this.gridRowZoomed,
          this.gridColZoomed
        );
      }
    }
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
    this.emptyArr = [];
    occupancyArray.forEach((columns, row) => {
      columns.forEach((label, col) => {
        if (label === '.') {
          this.emptyArr.push({
            x: { grid: this.gridRowZoomed, start: col, count: 1 },
            y: { grid: this.gridColZoomed, start: row, count: 1 },
          });
        }
      });
    });
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

  triggerSwap(step: StepsCfg) {
    if (!this.swapTarget) {
      this.swapTarget = step;
    } else if (this.swapTarget === step) {
      this.swapTarget = null;
    } else {
      if (this.swapTarget.label && step.label) {
        const tmp = this.swapTarget.label;
        this.swapTarget.label = step.label;
        step.label = tmp;
      } else {
        const tmpX = this.swapTarget.x;
        const tmpY = this.swapTarget.y;
        this.swapTarget.x = step.x;
        this.swapTarget.y = step.y;
        step.x = tmpX;
        step.y = tmpY;
        // todo: Change not detected in stepsArr
        this.stepsArr = JSON.parse(JSON.stringify(this.stepsArr));
      }
      this.swapTarget = null;
      this.onStepsChange();
    }
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
        } else {
          this.emptyArr.push({
            x: { grid: gridCol, start: col, count: 1 },
            y: { grid: gridRow, start: row, count: 1 },
          });
        }
      });
    });
    return Object.values(result);
  }
}
