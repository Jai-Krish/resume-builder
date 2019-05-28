import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'resume',
    loadChildren: './resume/resume.module#ResumeModule',
  },
  { path: '**', redirectTo: '/resume/view' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
