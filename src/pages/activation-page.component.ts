import {Component} from "@angular/core";
import {LoginService} from "core";

@Component({
  selector: "activation",
  templateUrl: "./activation-page.component.html"
})
export class ActivationPageComponent {
  public constructor(private loginService: LoginService) {
  }

  protected activateAccount(event): void {
    this.loginService.activate(event.password);
  }

  protected getLastError(): string {
    return this.loginService.getLastError();
  }
}