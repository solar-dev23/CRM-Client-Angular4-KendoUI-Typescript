import { Component } from "@angular/core";
import { LoginService } from "../../../core";

@Component({
  selector: "users",
  templateUrl: "./users.component.html"
})
export class UsersComponent {

  public constructor(private loginService: LoginService) {
  };

  protected logout(): void {
    this.loginService.logout();
  }

  protected get hasAdministrationPermission(): boolean {
    return this.loginService.hasAdministrationPermission()
  }
}