import { Component, OnInit, Input, HostListener } from '@angular/core';
import { LoginService } from "../../../core";
import _ from 'lodash';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	@Input() title: string;

	public showMenu: boolean= false;
  constructor(private loginService: LoginService) {
  }

  ngOnInit() {
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
  	// if(!_.includes(event.target.classList, 'menu-icon')){
   //    this.showMenu = false
   //  }
  }

  protected logout(): void {
    this.loginService.logout();
  }
}
