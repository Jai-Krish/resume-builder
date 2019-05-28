import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResumeViewComponent } from './resume-view/resume-view.component';

const routes: Routes = [
  {
    path: 'view',
    component: ResumeViewComponent,
  },
  { path: '**', redirectTo: 'view' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResumeRoutingModule {}
