import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentBlockComponent } from './content-block/content-block.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { GridEditComponent } from './grid-edit/grid-edit.component';

@NgModule({
  declarations: [ContentBlockComponent, GridEditComponent],
  imports: [CommonModule, FlexLayoutModule, DragDropModule],
  exports: [ContentBlockComponent, GridEditComponent],
})
export class DynamicLayoutModule {}
