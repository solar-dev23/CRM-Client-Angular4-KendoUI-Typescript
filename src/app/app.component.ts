import { Component } from "@angular/core";
import { LoginService } from "./core";

declare let $: any;

@Component({
  selector: "app",
  template: `<progress-dialog [progress]="inProgress()"></progress-dialog>
             <router-outlet></router-outlet>`,
  host: {'[class.ma-hide-confirmation]': 'inProgress()'}
})
export class AppComponent {

  public constructor(protected loginService: LoginService) {
  };

  protected inProgress(): boolean {
    return this.loginService.inProgress();
  }
}