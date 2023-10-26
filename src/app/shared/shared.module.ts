import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { LoaderComponent } from '../core/loader/loader.component';

@NgModule({

  imports: [
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    LoaderComponent,
    HttpClientModule,
    HttpClientModule,
    CommonModule,
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    LoaderComponent,
    HttpClientModule,
    HttpClientModule,
    CommonModule,
  ],
  declarations: [
  ]
})
export class SharedModule { }
