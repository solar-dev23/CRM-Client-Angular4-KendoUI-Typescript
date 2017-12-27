import { NgModule } from "@angular/core";
import { LocalStorageModule, LocalStorageService } from "angular-2-local-storage";
import { Http, HttpModule, RequestOptions, XHRBackend } from "@angular/http";
import { LoginService } from "./service/login.service";
import { UserService } from "./service/user.service";
import { HttpController } from "./service/http-controller";
import { RouteController } from "./service/route-controller.service";
import { DashboardService } from "./service/dashboard.service";


@NgModule({
  imports: [
    HttpModule,
    LocalStorageModule.withConfig({
      prefix: "ma-boiler-plate",
      storageType: "localStorage"
    })
  ],
  providers: [
    LoginService,
    UserService,
    LocalStorageService,
    RouteController,
    DashboardService,
    {
      provide: Http,
      deps: [XHRBackend, RequestOptions],
      useFactory: (backend: XHRBackend, options: RequestOptions) => {
        return new HttpController(backend, options);
      }
    }
  ],
})
export class CoreModule {
}