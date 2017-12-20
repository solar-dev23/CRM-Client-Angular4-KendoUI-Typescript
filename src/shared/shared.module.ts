import "./shared.module.less";
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {ProgressDialogComponent} from "./progress-dialog.component";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule
  ],
  declarations: [
    ProgressDialogComponent
  ],
  exports: [
    ProgressDialogComponent
  ]
})
export class SharedModule {
}