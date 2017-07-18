import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MdButtonModule, MdCheckboxModule, MdTableModule, MdInputModule, MdPaginatorModule, MdSortModule } from '@angular/material';
import {CdkTableModule} from '@angular/cdk';
import 'hammerjs';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    // must come after browser module
    BrowserAnimationsModule,
    MdButtonModule,
    MdCheckboxModule,
    MdTableModule,
    MdInputModule,
    CdkTableModule,
    MdPaginatorModule,
    MdSortModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
