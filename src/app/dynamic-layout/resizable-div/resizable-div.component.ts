import {
  Component,
  OnInit,
  ViewChild,
  Input,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { CdkDragMove, CdkDragRelease, CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-resizable-div',
  templateUrl: './resizable-div.component.html',
  styleUrls: ['./resizable-div.component.scss'],
})
export class ResizableDivComponent implements OnInit {
  @Input()
  private height?: number;
  @Input()
  private width?: number;
  @Input()
  public steps: number | StepsCfg = 1;
  @Output()
  public stepsChange = new EventEmitter<StepsCfg>();
  @Input()
  public canGrow: (str: number, axis: string) => boolean;

  dimension = {
    x: 0,
    y: 0,
    translate: {
      x: 0,
      y: 0,
    },
  };
  public dragHandle = {
    axis: 'x',
    style: {
      width: 0,
      height: 0,
      top: 0,
      left: 0,
    },
  };
  private dragOffset = {
    x: 0,
    y: 0,
  };
  isDragging = false;
  side: number;

  @ViewChild(CdkDrag, { static: true })
  dragHandleCmp: CdkDrag;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    if (this.steps && typeof this.steps !== 'number') {
      this.width = 0;
      for (
        let i = this.steps.x.start;
        i < this.steps.x.start + this.steps.x.count;
        i++
      ) {
        this.width += this.steps.x.grid[i];
      }
      this.height = 0;
      for (
        let i = this.steps.y.start;
        i < this.steps.y.start + this.steps.y.count;
        i++
      ) {
        this.height += this.steps.y.grid[i];
      }
      this.dimension.translate.x =
        this.steps.x.start > 0
          ? this.steps.x.grid
              .slice()
              .splice(0, this.steps.x.start)
              .reduce((acc, cur) => (acc += cur))
          : 0;
      this.dimension.translate.y =
        this.steps.y.start > 0
          ? this.steps.y.grid
              .slice()
              .splice(0, this.steps.y.start)
              .reduce((acc, cur) => (acc += cur))
          : 0;
    } else {
      const boundingBox = this.elementRef.nativeElement
        .getElementsByClassName('wrapper')[0]
        .getBoundingClientRect();
      this.height = this.height ? this.height : boundingBox.height;
      this.width = this.width ? this.width : boundingBox.width;
    }
    this.dimension.x = this.width;
    this.dimension.y = this.height;
  }

  mouseover(event: MouseEvent, axis: string, side) {
    if (!this.isDragging) {
      this.side = side;
      this.dragHandleCmp.reset();
      this.dragHandle.axis = axis;
      this.dragOffset.x = 0;
      this.dragOffset.y = 0;
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      ['width', 'height', 'top', 'left'].forEach(key => {
        this.dragHandle.style[key] = rect[key] + 'px';
      });
    }
  }

  dragEnded(event: CdkDragRelease) {
    this.isDragging = false;
    this.height = this.dimension.y;
    this.width = this.dimension.x;
    this.dragOffset.x = 0;
    this.dragOffset.y = 0;
  }

  dragging(event: CdkDragMove) {
    if (typeof this.steps === 'number') {
      const steps = this.steps;
      this.dimension.y =
        this.height + this.roundup(event.distance.y, steps / 2, steps);
      this.dimension.x =
        this.width + this.roundup(event.distance.x, steps / 2, steps);
    } else {
      // If using advanced config for steps
      if (event.delta.x !== 0) {
        this.resize(event, 'x');
      }
      if (event.delta.y !== 0) {
        this.resize(event, 'y');
      }
    }
  }

  private resize(event: CdkDragMove, axis: string) {
    const isGrowing =
      this.side > 0 ? event.delta[axis] > 0 : event.delta[axis] < 0;
    if (isGrowing) {
      // Growing
      const gridIndex =
        this.side > 0
          ? this.steps[axis].start + this.steps[axis].count
          : this.steps[axis].start - 1;
      const step = this.steps[axis].grid[gridIndex];
      if (!step) {
        // No grids to occupy
        return;
      }
      const roundup = this.roundup(
        this.side * (event.distance[axis] + this.dragOffset[axis]),
        step / 2,
        step
      );
      const newDimension = this.dimension[axis] + roundup;
      if (this.dimension[axis] < newDimension) {
        if (!this.canGrow(this.side, axis)) {
          return;
        }
        this.dimension[axis] = newDimension;
        if (this.side > 0) {
          this.steps[axis].count = this.steps[axis].count + 1;
        } else {
          this.dimension.translate[axis] -= step;
          this.steps[axis].start = this.steps[axis].start - 1;
          this.steps[axis].count = this.steps[axis].count + 1;
        }
        this.dragOffset[axis] = this.dragOffset[axis] - step * this.side;
        this.stepsChange.emit(this.steps as StepsCfg);
      }
    } else {
      // Shrinking
      if (this.steps[axis].count === 1) {
        // At the min size
        return;
      }
      const gridIndex =
        this.side > 0
          ? this.steps[axis].start + (this.steps[axis].count - 1)
          : this.steps[axis].start;
      const step = this.steps[axis].grid[gridIndex];
      if (this.side > 0) {
        // Right or Bottom
        const roundup = this.roundup(
          event.distance[axis] + this.dragOffset[axis] + step,
          step / 2,
          step
        );
        const newWidth = this.dimension[axis] + roundup;
        if (this.dimension[axis] >= newWidth) {
          this.dimension[axis] = newWidth - step;
          this.steps[axis].count = this.steps[axis].count - 1;
          this.dragOffset[axis] += step;
          this.stepsChange.emit(this.steps as StepsCfg);
        }
      } else {
        // Left or Top
        const roundup = this.roundup(
          event.distance[axis] + this.dragOffset[axis],
          step / 2,
          step
        );
        const newWidth = this.dimension[axis] - roundup;
        if (this.dimension[axis] > newWidth) {
          this.dimension[axis] = newWidth;
          this.dimension.translate[axis] += step;
          this.steps[axis].count = this.steps[axis].count - 1;
          this.steps[axis].start = this.steps[axis].start + 1;
          this.dragOffset[axis] -= step;
          this.stepsChange.emit(this.steps as StepsCfg);
        }
      }
    }
  }

  private roundup(value: number, min: number, roundTo: number, offset = 0) {
    const mod = (value + offset) % roundTo;
    if (mod > min) {
      return value + (roundTo - mod);
    } else {
      return value - mod;
    }
  }
}

export interface StepsCfg {
  label?: string;
  x: {
    grid: number[];
    start: number;
    count: number;
  };
  y: {
    grid: number[];
    start: number;
    count: number;
  };
}
