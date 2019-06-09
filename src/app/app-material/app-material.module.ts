import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  exports: [
    MatIconModule, //
    MatInputModule,
    MatSelectModule,
  ],
})
export class AppMaterialModule {}
