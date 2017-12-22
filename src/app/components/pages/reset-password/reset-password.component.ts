import { Component } from "@angular/core";
import { LoginService } from "../../../core";

@Component({
  selector: "activation",
  templateUrl: "./reset-password.component.html"
})
export class ResetPasswordComponent {
  public constructor(private loginService: LoginService) {
  }

  protected resetPassword(event): void {
    this.loginService.resetPassword(event.password);
  }

  protected getLastError(): string {
    return this.loginService.getLastError();
  }
}