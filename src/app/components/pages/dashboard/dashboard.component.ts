import { Component } from '@angular/core';
import { LoginService } from "../../../core";

@Component({
	selector: 'dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  public constructor(private loginService: LoginService) {

  }

  ngOnInit() {
  }
}
