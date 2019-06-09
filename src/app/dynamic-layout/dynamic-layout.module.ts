import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentBlockComponent } from './content-block/content-block.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ResizableDivComponent } from './resizable-div/resizable-div.component';
import { GridEditComponent } from './grid-edit/grid-edit.component';
import { GridRowColComponent } from './grid-row-col/grid-row-col.component';
import { AppMaterialModule } from '../app-material/app-material.module';

@NgModule({
  declarations: [
    ContentBlockComponent,
    GridEditComponent,
    ResizableDivComponent,
    GridRowColComponent,
  ],
  imports: [CommonModule, FlexLayoutModule, DragDropModule, AppMaterialModule],
  exports: [
    ContentBlockComponent,
    GridEditComponent,
    ResizableDivComponent,
    GridRowColComponent,
  ],
})
export class DynamicLayoutModule {}
