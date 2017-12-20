import {Component} from "@angular/core";
import {Http} from "@angular/http";
import {Utils} from "crm-platform";
import {LoginService} from "core";
import {RegistrationFormGroup} from "./registration-form-group";

@Component({
  selector: "registration",
  templateUrl: "./registration-page.component.html"
})
export class RegistrationPageComponent {
  protected registrationFormGroup: RegistrationFormGroup;
  protected registered: boolean = false;
  protected supportEmail: string;

  protected get integerFormat(): string {
    return Utils.getNumericFieldFormat(true);
  }

  public constructor(private loginService: LoginService, private http: Http) {
    this.registrationFormGroup = new RegistrationFormGroup(http);
  }

  protected register(): void {
    this.loginService.register(this.registrationFormGroup.getRegistrationData()).subscribe((res) => {
      this.supportEmail = res.supportEmail;
      this.registered = true;
    });
  }

  protected getErrorMessage(fieldName: string): string {
    return this.registrationFormGroup.getErrorMessage(fieldName);
  }

  protected getLastError(): string {
    return this.loginService.getLastError();
  }
}