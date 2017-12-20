import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {CoreModule} from "core";
import {AppComponent} from "app.component";
import {appRoutes, PagesModule} from "pages";
import {SharedModule} from "shared";

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {useHash: false}),
    CoreModule,
    FormsModule,
    PagesModule,
    SharedModule,
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
