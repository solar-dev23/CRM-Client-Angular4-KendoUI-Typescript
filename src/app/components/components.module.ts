import "./components.module.less";
import { NgModule } from "@angular/core";
import { PagesModule } from "./pages";
import { SharedModule } from "./shared";


@NgModule({
  imports: [
    PagesModule,
    SharedModule
  ],
  declarations: [],
  exports: [
  	SharedModule
  ]
})
export class ComponentsModule {
}