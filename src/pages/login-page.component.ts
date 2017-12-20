import {Component} from "@angular/core";
import {LoginService} from "core";
import {EmailFormGroup} from "./email-form-group";

@Component({
  selector: "login",
  templateUrl: "./login-page.component.html"
})
export class LoginPageComponent {
  protected username: string;
  protected password: string;
  protected emailFormGroup: EmailFormGroup;
  protected userForgotPassword = false;
  protected restorePasswordMessageSent = false;

  public constructor(private loginService: LoginService) {
    this.emailFormGroup = new EmailFormGroup();
  }

  protected login(): void {
    if (!this.userForgotPassword) {
      this.loginService.login(this.username, this.password);
      this.username = "";
      this.password = "";
    } else {
      this.loginService.resetLastError();
      this.userForgotPassword = false;
    }
  }

  protected getLastError(): string {
    return this.loginService.getLastError();
  }

  protected getErrorMessage(fieldName: string): string {
    return this.emailFormGroup.getErrorMessage(fieldName);
  }


  protected restorePassword(): void {
    if (this.userForgotPassword) {
      this.loginService.requestResetPassword(this.emailFormGroup.getEmail()).subscribe(() =>
        this.restorePasswordMessageSent = true);
    } else {
      this.loginService.resetLastError();
      this.userForgotPassword = true;
    }
  }
}