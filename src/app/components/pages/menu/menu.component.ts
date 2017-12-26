import { Component, OnInit, HostListener, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { LoginService, UserService } from "../../../core";
// import { HttpService } from "../../services/http.service";
// import { EventEmitterService } from "../../services/event-emitter.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {

  public menuToggled: boolean = true;
  public width: number;
  public defaultWidth: number;
  public mousemoveEvent: any; 
  public mouseupEvent: any;
  public collapsedWidth: number = 58;
  public expandedWidth: number = 250;
  public logoStyle: any;
  public wrapperStyle: any;
  public loggedUser: any;
  
  @ViewChild('sidebar') sidebar: ElementRef;

  // constructor(private httpService:HttpService, private elementRef: ElementRef, private renderer: Renderer2, private _eventEmitter: EventEmitterService) {
  constructor(private elementRef: ElementRef, private renderer: Renderer2, private loginService: LoginService, private userService: UserService) {
    this.mouseup = this.unboundMouseup.bind(this);
    this.dragging = this.unboundDragging.bind(this);
  }

  ngOnInit() {
    this.loggedUser = this.loginService.getUserData();
    if(this.loggedUser.wide_menu){
      this.menuToggled = true;
      this.logoStyle = {
        'width': '150px',
        'margin-left': '50px'
      }
      // this._eventEmitter.menuChange('expanded');
    } else{
      this.menuToggled = false;
      this.logoStyle = {
        'width': '50px',
        'margin-left': '4px'
      }
      // this._eventEmitter.menuChange('collapsed');
    }
  }

  ngAfterViewInit() {
    this.defaultWidth = this.sidebar.nativeElement.offsetWidth;
  }

  toggleMenu() {
    this.menuToggled = !this.menuToggled;
    let updatedUserParams = {}

    if(this.menuToggled){
      this.width = this.defaultWidth;

      this.logoStyle = {
        'width': '150px',
        'margin-left': '50px'
      }

      updatedUserParams = {
        id: this.loggedUser.id,
        wide_menu: true
      }

      // this._eventEmitter.menuChange('expanded');
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

      // this._eventEmitter.menuChange('collapsed');
    }

    this.userService.updateUser(updatedUserParams).subscribe(
        res => {
          console.log("menu status successfully updated.");
        },
        err => console.log(err, 'opportunity update error')
      )
  }

  onEdgeHover(event) {
  }

  mousedown(event: any) {
    if(event.target != event.currentTarget)
      return;

    if (event.button === 0/*only left mouse click*/) {

      if(this.menuToggled){
        this.width = this.defaultWidth;

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

  mouseup: (event: any) => void;
  unboundMouseup(event: any) {
    let updatedUserParams = {}

    if( (this.defaultWidth * 2)/3 < event.clientX )
      this.width = this.defaultWidth;
    else
      this.width = this.collapsedWidth;

    if(this.width == this.defaultWidth){
      this.menuToggled = true;

      this.logoStyle = {
        'width': '150px',
        'margin-left': '50px'
      }

      updatedUserParams = {
        id: this.loggedUser.id,
        wide_menu: true
      }

      // this._eventEmitter.menuChange('expanded');
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

      // this._eventEmitter.menuChange('collapsed');
    }

    // this.httpService.updateUser(updatedUserParams).subscribe(
    //     res => {
    //       console.log("menu status successfully updated.");
    //     },
    //     err => console.log(err, 'opportunity update error')
    //   )

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

  dragging: (event: any) => void;
  unboundDragging(event: any) {
    this.width = event.clientX;
  }
}
