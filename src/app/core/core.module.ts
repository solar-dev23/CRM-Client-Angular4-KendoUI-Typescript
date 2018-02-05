import { NgModule } from "@angular/core";
import { LocalStorageModule, LocalStorageService } from "angular-2-local-storage";
import { Http, HttpModule, RequestOptions, XHRBackend } from "@angular/http";
import { LoginService } from "./service/login.service";
import { UserService } from "./service/user.service";
import { HttpController } from "./service/http-controller";
import { RouteController } from "./service/route-controller.service";
import { DashboardService } from "./service/dashboard.service";
import { OpportunityService } from "./service/opportunity.service";
import { StatusService } from "./service/status.service";
import { ReminderService } from "./service/reminder.service";
import { EventEmitterService } from "./service/event-emitter.service";
import { ContactService } from "./service/contact.service";
import { AccountService } from "./service/account.service";
import { AddressService } from "./service/address.service";
import { RoleService } from "./service/role.service";
import { SocialNetworkService } from "./service/social-network.service";
import { DepartmentService } from "./service/department.service";

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
    OpportunityService,
    StatusService,
    ReminderService,
    EventEmitterService,
    ContactService,
    AccountService,
    AddressService,
    RoleService,
    SocialNetworkService,
    DepartmentService,
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