import { Component } from "@angular/core";
import { LoginService } from "../../../core";

@Component({
  selector: "users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"]
})
export class UsersComponent {
	public viewOpt: string = 'card';

  public constructor(private loginService: LoginService) {
  };

  protected get hasAdministrationPermission(): boolean {
    return this.loginService.hasAdministrationPermission()
  }

  onChangeView(val) {
    this.viewOpt = val;
  }
}