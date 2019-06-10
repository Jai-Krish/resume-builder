import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  exports: [
    MatIconModule, //
    MatInputModule,
    MatSelectModule,
    MatCardModule,
  ],
})
export class AppMaterialModule {}
