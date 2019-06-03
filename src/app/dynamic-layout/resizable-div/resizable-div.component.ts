import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
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
  private steps: number | StepsCfg = 1;

  dimension = {
    x: 0,
    y: 0,
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
  @ViewChild(CdkDrag, { static: true })
  dragHandleCmp: CdkDrag;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    const boundingBox = this.elementRef.nativeElement.getBoundingClientRect();
    this.height = this.height ? this.height : boundingBox.height;
    this.dimension.y = this.height;
    this.width = this.width ? this.width : boundingBox.width;
    this.dimension.x = this.width;
  }

  mouseover(event: MouseEvent, axis: string) {
    if (!this.isDragging) {
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
    const isPositive = event.delta[axis] > 0;
    if (isPositive) {
      const step = this.steps[axis].grid[this.steps[axis].position + 1]; //Get next from array
      if (!step) {
        // Already at the last grid
        return;
      }
      const roundup = this.roundup(
        event.distance[axis] + this.dragOffset[axis],
        step / 2,
        step
      );
      const newDimension = this.dimension[axis] + roundup;
      if (this.dimension[axis] < newDimension) {
        this.dimension[axis] = newDimension;
        this.steps[axis].position = this.steps[axis].position + 1;
        this.dragOffset[axis] -= step;
      }
    } else {
      const step = this.steps[axis].grid[this.steps[axis].position];
      if (!this.steps[axis].grid[this.steps[axis].position - 1]) {
        // Already at the first grid
        return;
      }
      const roundup = this.roundup(
        event.distance[axis] + this.dragOffset[axis] + step,
        step / 2,
        step
      );
      const newWidth = this.dimension[axis] + roundup;
      if (this.dimension[axis] >= newWidth) {
        this.dimension[axis] = newWidth - step;
        this.steps[axis].position = this.steps[axis].position - 1;
        this.dragOffset[axis] += step;
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
  x: {
    grid: number[];
    position: number;
  };
  y: {
    grid: number[];
    position: number;
  };
}
