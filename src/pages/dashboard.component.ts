import {Component} from "@angular/core";
import {LoginService} from "core";

@Component({
  selector: "dashboard",
  templateUrl: "./dashboard.component.html"
})
export class DashboardComponent {

  public constructor(private loginService: LoginService) {
  };

  protected logout(): void {
    this.loginService.logout();
  }

  protected get hasAdministrationPermission(): boolean {
    return this.loginService.hasAdministrationPermission()
  }
}