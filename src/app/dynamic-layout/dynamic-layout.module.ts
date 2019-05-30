import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentBlockComponent } from './content-block/content-block.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [ContentBlockComponent],
  imports: [CommonModule, FlexLayoutModule],
  exports: [ContentBlockComponent],
})
export class DynamicLayoutModule {}
