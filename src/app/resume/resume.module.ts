import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResumeRoutingModule } from './resume-routing.module';
import { ResumeViewComponent } from './resume-view/resume-view.component';

@NgModule({
  declarations: [ResumeViewComponent],
  imports: [
    CommonModule, //
    ResumeRoutingModule,
  ],
})
export class ResumeModule {}
