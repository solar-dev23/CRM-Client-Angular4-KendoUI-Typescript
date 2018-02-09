import { Component, OnInit, HostListener, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { LoginService, UserService, EventEmitterService } from "../../../core";

declare var $: any;
declare var SVGInjector: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {

  public menuToggled: boolean = true;
  public width: number;
  public mousemoveEvent: any; 
  public mouseupEvent: any;
  public collapsedWidth: number = 58;
  public expandedWidth: number = 250;
  public logoStyle: any;
  public wrapperStyle: any;
  public loggedUser: any;
  
  @ViewChild('sidebar') sidebar: ElementRef;

  constructor(
    private elementRef: ElementRef, 
    private renderer: Renderer2, 
    private loginService: LoginService, 
    private _eventEmitter: EventEmitterService,
    private userService: UserService) 
  {
    this.mouseup = this.unboundMouseup.bind(this);
    this.dragging = this.unboundDragging.bind(this);
  }

  public ngOnInit() {
    this.loggedUser = this.loginService.getUserData();
    if(this.loggedUser.wide_menu){
      this.menuToggled = true;
      this.logoStyle = {
        'width': '150px',
        'margin-left': '50px'
      }
      this._eventEmitter.menuChange('expanded');
    } else{
      this.menuToggled = false;
      this.logoStyle = {
        'width': '50px',
        'margin-left': '4px'
      }
      this._eventEmitter.menuChange('collapsed');
    }

    let mySVGsToInject = document.querySelectorAll('img.inject-me');
    SVGInjector(mySVGsToInject);
  }

  protected get hasAdministrationPermission(): boolean {
    return this.loginService.hasAdministrationPermission();
  }


  protected toggleMenu() {
    this.menuToggled = !this.menuToggled;
    let updatedUserParams = {}

    if(this.menuToggled){
      this.width = this.expandedWidth;

      this.logoStyle = {
        'width': '150px',
        'margin-left': '50px'
      }

      updatedUserParams = {
        id: this.loggedUser.id,
        wide_menu: true
      }

      this._eventEmitter.menuChange('expanded');
    } else{
      this.width = this.collapsedWidth;

      this.logoStyle = {
        'width': '50px',
        'margin-left': '4px'
      }

      updatedUserParams = {
        id: this.loggedUser.id,
        wide_menu: false
      }

      this._eventEmitter.menuChange('collapsed');
    }

    this.userService.update(updatedUserParams).subscribe(
        res => {
          let userData = this.loggedUser;
          userData.wide_menu = updatedUserParams['wide_menu'];
          this.loginService.setUserData(userData);
        },
        err => console.log(err, 'opportunity update error')
      )
  }

  protected mousedown(event: any) {
    if(event.target != event.currentTarget)
      return;

    if (event.button === 0/*only left mouse click*/) {

      if(this.menuToggled){
        this.width = this.expandedWidth;

        this.logoStyle = {
          'width': '150px',
          'margin-left': '50px'
        }
      } else {
        this.width = this.collapsedWidth;

        this.logoStyle = {
          'width': '50px',
          'margin-left': '4px'
        }
      }

      this.wrapperStyle = {
        '-webkit-user-select': 'none',
        '-moz-user-select': 'none',
        '-ms-user-select': 'none',
        '-o-user-select': 'none',
        'user-select': 'none'
      }

      // if listeners exist, first Remove listeners
      if (this.mousemoveEvent)
          this.mousemoveEvent();
      if (this.mouseupEvent)
          this.mouseupEvent();

      this.mousemoveEvent = this.renderer.listen("document", "mousemove", this.dragging);
      this.mouseupEvent = this.renderer.listen("document", "mouseup", this.mouseup);
    }
  }

  protected mouseup: (event: any) => void;
  protected unboundMouseup(event: any) {
    let updatedUserParams = {}

    if( (this.expandedWidth * 2)/3 < event.clientX )
      this.width = this.expandedWidth;
    else
      this.width = this.collapsedWidth;

    if(this.width == this.expandedWidth){
      this.menuToggled = true;

      this.logoStyle = {
        'width': '150px',
        'margin-left': '50px'
      }

      updatedUserParams = {
        id: this.loggedUser.id,
        wide_menu: true
      }

      this._eventEmitter.menuChange('expanded');
    } else {
      this.menuToggled = false;

      this.logoStyle = {
        'width': '50px',
        'margin-left': '4px'
      }

      updatedUserParams = {
        id: this.loggedUser.id,
        wide_menu: false
      }

      this._eventEmitter.menuChange('collapsed');
    }

    this.userService.update(updatedUserParams).subscribe(
        res => {
          let userData = this.loggedUser;
          userData.wide_menu = updatedUserParams['wide_menu'];
          this.loginService.setUserData(userData);
        },
        err => console.log(err, 'opportunity update error')
      )

    this.wrapperStyle = {
      '-webkit-user-select': 'auto',
      '-moz-user-select': 'auto',
      '-ms-user-select': 'auto',
      '-o-user-select': 'auto',
      'user-select': 'auto'
    }

    // Remove listeners
    this.mousemoveEvent();
    this.mouseupEvent();
  }

  protected dragging: (event: any) => void;
  protected unboundDragging(event: any) {
    this.width = event.clientX;
  }
}
