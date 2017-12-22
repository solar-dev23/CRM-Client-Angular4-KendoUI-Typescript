import { Component } from "@angular/core";
import { LoginService } from "../../../core";

@Component({
  selector: "activation",
  templateUrl: "./activation.component.html"
})
export class ActivationComponent {
  public constructor(private loginService: LoginService) {
  }

  protected activateAccount(event): void {
    this.loginService.activate(event.password);
  }

  protected getLastError(): string {
    return this.loginService.getLastError();
  }
}