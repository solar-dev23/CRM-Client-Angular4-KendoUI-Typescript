import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from "@angular/router";
import {LoginService} from "./login.service";
import {ROUTE} from "../constants";

@Injectable()
export class RouteController implements CanActivate, CanActivateChild {

  public constructor(private loginService: LoginService, private router: Router) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkRoute(state);
  }

  public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkRoute(state);
  }

  public checkRoute(state: RouterStateSnapshot): boolean {
    let canNavigate = true;
    let url = state.root.firstChild.routeConfig.path;
    if (url === ROUTE.dashboard && !this.loginService.isLoggedIn()) {
      this.router.navigate([ROUTE.login]);
      canNavigate = false;
    }
    return canNavigate;
  }
}