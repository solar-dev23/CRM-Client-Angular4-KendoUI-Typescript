import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app.routes';
import { AppComponent } from "./app.component";
import { CoreModule } from "./core";
import { ComponentsModule } from "./components";

import 'hammerjs';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent
  ],
  imports: [
  	RouterModule,
  	FormsModule,
  	BrowserModule,
  	BrowserAnimationsModule,
  	HttpModule,

  	AppRoutingModule,
    CoreModule,
    ComponentsModule
  ],
  providers: []
})
export class AppModule {
}
