import { Component } from "@angular/core";
import { LoginService } from "../../core";

@Component({
  selector: "app-home",
  template: `<app-menu><router-outlet></router-outlet></app-menu>`
})
export class HomeComponent {

  public constructor(protected loginService: LoginService) {
  };
}