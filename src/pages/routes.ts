import {Routes} from "@angular/router";
import {RouteController, ROUTE} from "core";
import {LoginPageComponent} from "./login-page.component";
import {DashboardComponent} from "./dashboard.component";
import {RegistrationPageComponent} from "./registration-page.component";
import {ActivationPageComponent} from "./activation-page.component";
import {ResetPasswordPageComponent} from "./reset-password-page.component";

export const appRoutes: Routes = [
  {path: ROUTE.dashboard, component: DashboardComponent, canActivate: [RouteController]},
  {path: ROUTE.login, component: LoginPageComponent, canActivate: [RouteController]},
  {path: ROUTE.sign_up, component: RegistrationPageComponent, canActivate: [RouteController]},
  {path: ROUTE.activate_user, component: ActivationPageComponent, canActivate: [RouteController]},
  {path: ROUTE.reset_password, component: ResetPasswordPageComponent, canActivate: [RouteController]},
  {path: "**", redirectTo: ROUTE.dashboard, pathMatch: 'full'}
];