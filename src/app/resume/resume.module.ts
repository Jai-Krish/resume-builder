import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResumeRoutingModule } from './resume-routing.module';
import { ResumeViewComponent } from './resume-view/resume-view.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DynamicLayoutModule } from '../dynamic-layout/dynamic-layout.module';
import { AppMaterialModule } from '../app-material/app-material.module';

@NgModule({
  declarations: [ResumeViewComponent],
  imports: [
    CommonModule, //
    ResumeRoutingModule,
    FlexLayoutModule,
    DynamicLayoutModule,
    AppMaterialModule,
  ],
})
export class ResumeModule {}
