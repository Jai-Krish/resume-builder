import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentBlockComponent } from './content-block/content-block.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { GridEditComponent } from './grid-edit/grid-edit.component';
import { ResizableDivComponent } from './resizable-div/resizable-div.component';
import { GridEdit2Component } from './grid-edit2/grid-edit2.component';
import { GridRowColComponent } from './grid-row-col/grid-row-col.component';

@NgModule({
  declarations: [
    ContentBlockComponent,
    GridEditComponent,
    GridEdit2Component,
    ResizableDivComponent,
    GridRowColComponent,
  ],
  imports: [CommonModule, FlexLayoutModule, DragDropModule],
  exports: [
    ContentBlockComponent,
    GridEditComponent,
    GridEdit2Component,
    ResizableDivComponent,
    GridRowColComponent,
  ],
})
export class DynamicLayoutModule {}
