import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { StepsCfg } from '../resizable-div/resizable-div.component';

@Component({
  selector: 'app-grid-edit',
  templateUrl: './grid-edit.component.html',
  styleUrls: ['./grid-edit.component.scss'],
})
export class GridEditComponent implements OnInit, OnChanges {
  @Input()
  zoom = 2;
  @Input()
  grid: string[][];
  @Output()
  gridChange = new EventEmitter<string[][]>();
  @Input()
  gridRowStr: string[];
  @Input()
  gridColStr: string[];
  @Output()
  gridAdd = new EventEmitter<{ x: number; y: number }>();
  @Output()
  gridRemove = new EventEmitter<string>();

  colors = {};
  stepsArr: StepsCfg[];
  emptyArr: StepsCfg[] = [];
  swapTarget: StepsCfg;

  private gridColSize: number[];
  private gridRowSize: number[];
  private gridColZoomed: number[];
  private gridRowZoomed: number[];

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes) {
    if (changes.grid) {
      if (!this.grid) {
        this.grid = undefined;
        this.stepsArr = undefined;
      }
    }
    if (changes.gridRowStr) {
      this.gridRowSize = this.gridRowStr
        ? Array(this.gridRowStr.length).fill(100 / this.gridRowStr.length)
        : [];
    }
    if (changes.gridColStr) {
      this.gridColSize = this.gridColStr
        ? Array(this.gridColStr.length).fill(100 / this.gridColStr.length)
        : [];
    }

    this.gridRowZoomed = this.gridRowSize.map(res => res * this.zoom);
    this.gridColZoomed = this.gridColSize.map(res => res * this.zoom);
    if (
      changes.grid ||
      changes.gridRowStr ||
      changes.gridColStr ||
      changes.zoom
    ) {
      if (this.grid) {
        this.stepsArr = this.createGridObj(
          this.grid,
          this.gridRowZoomed,
          this.gridColZoomed
        );
        this.emptyArr = [];
        this.grid.forEach((columns, row) => {
          columns.forEach((label, col) => {
            if (label === '.') {
              this.emptyArr.push({
                x: { grid: this.gridColZoomed, start: col, count: 1 },
                y: { grid: this.gridRowZoomed, start: row, count: 1 },
              });
            }
          });
        });
      }
    }
  }

  onStepsChange() {
    this.swapTarget = null;
    const occupancyArray = Array(this.gridRowSize.length)
      .fill(Array(this.gridColSize.length).fill('.'))
      .map(_ => Array(this.gridColSize.length).fill('.'));
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
            x: { grid: this.gridColZoomed, start: col, count: 1 },
            y: { grid: this.gridRowZoomed, start: row, count: 1 },
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

  addRow(gridRowStr: string[], index: number) {
    gridRowStr.splice(index + 1, 0, 'auto');
    this.grid.splice(index + 1, 0, Array(this.grid[0].length).fill('.'));
    this.ngOnChanges({ gridRowStr: true });
    this.onStepsChange();
  }

  removeRow(gridRowStr: string[], index: number) {
    for (const grid of this.grid[index]) {
      if (grid !== '.') {
        alert('Row not empty');
        return;
      }
    }
    gridRowStr.splice(index, 1);
    this.grid.splice(index, 1);
    this.ngOnChanges({ gridRowStr: true });
    this.onStepsChange();
  }

  addCol(gridColStr: string[], index: number) {
    gridColStr.splice(index + 1, 0, 'auto');
    this.grid.forEach(res => {
      res.splice(index + 1, 0, '.');
    });
    this.ngOnChanges({ gridColStr: true });
    this.onStepsChange();
  }

  removeCol(gridColStr: string[], index: number) {
    for (const grids of this.grid) {
      if (grids[index] !== '.') {
        alert('Column not empty');
        return;
      }
    }
    gridColStr.splice(index, 1);
    this.grid.forEach(res => {
      res.splice(index, 1);
    });
    this.ngOnChanges({ gridColStr: true });
    this.onStepsChange();
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
            : (
                '000000' + Math.floor(Math.random() * 16777215).toString(16)
              ).substr(-6);
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
