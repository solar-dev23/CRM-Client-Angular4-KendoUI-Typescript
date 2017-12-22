import { Component } from "@angular/core";
import { LoginService } from "./core";

@Component({
  selector: "app",
  template: `<progress-dialog [progress]="inProgress()"></progress-dialog>
             <app-menu><router-outlet></router-outlet></app-menu>`,
  host: {'[class.ma-hide-confirmation]': 'inProgress()'}
})
export class AppComponent {

  public constructor(protected loginService: LoginService) {
  };

  protected inProgress(): boolean {
    return this.loginService.inProgress();
  }
}