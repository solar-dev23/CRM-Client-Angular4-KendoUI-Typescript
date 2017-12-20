import {Component, EventEmitter, Input, Output} from "@angular/core";
import {PasswordFormGroup} from "core";

@Component({
  selector: "[passwordForm]",
  templateUrl: "./password-form.component.html"
})
export class PasswordFormComponent {
  @Output() onChangePassword: EventEmitter<any> = new EventEmitter();
  @Input() title: boolean = false;
  @Input() actionTitle: boolean = false;
  @Input() passwordChangeError: boolean = false;

  protected passwordFormGroup: PasswordFormGroup = new PasswordFormGroup(true, true);

  public constructor() {
  }

  protected getErrorMessage(fieldName: string): string {
    return this.passwordFormGroup.getErrorMessage(fieldName);
  }

  protected getPasswordMatchesErrorMessage(): string {
    return this.passwordFormGroup.getPasswordMatchesErrorMessage();
  }

  protected setPassword(): void {
    let password = this.passwordFormGroup.getPassword();
    this.passwordFormGroup.setValue({password: "", confirmPassword: ""});
    this.onChangePassword.emit({password: password});
  }
}