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
  private steps = 1;

  dimension = {
    height: 0,
    width: 0,
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
  @ViewChild(CdkDrag, { static: true })
  dragHandleCmp: CdkDrag;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    const boundingBox = this.elementRef.nativeElement.getBoundingClientRect();
    this.height = this.height ? this.height : boundingBox.height;
    this.dimension.height = this.height;
    this.width = this.width ? this.width : boundingBox.width;
    this.dimension.width = this.width;
  }

  mouseover(event: MouseEvent, axis: string) {
    this.dragHandleCmp.reset();
    this.dragHandle.axis = axis;
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    ['width', 'height', 'top', 'left'].forEach(key => {
      this.dragHandle.style[key] = rect[key] + 'px';
    });
  }

  dragging(event: CdkDragMove) {
    this.dimension.height =
      this.height + this.roundup(event.distance.y, this.steps / 2, this.steps);

    this.dimension.width =
      this.width + this.roundup(event.distance.x, this.steps / 2, this.steps);
  }

  dragEnded(event: CdkDragRelease) {
    this.height = this.dimension.height;
    this.width = this.dimension.width;
  }

  private roundup(value: number, min: number, roundTo: number) {
    const mod = value % roundTo;
    if (mod > min) {
      return value + (roundTo - mod);
    } else {
      return value - mod;
    }
  }
}
