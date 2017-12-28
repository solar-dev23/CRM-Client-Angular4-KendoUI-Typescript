import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { RouteController, ROUTE } from "./core";

import { LoginComponent } from "./components/pages/login/login.component";
import { RegistrationComponent } from "./components/pages/registration/registration.component";
import { ActivationComponent } from "./components/pages/activation/activation.component";
import { ResetPasswordComponent } from "./components/pages/reset-password/reset-password.component";
import { HomeComponent } from "./components/pages/home.component";
import { DashboardComponent } from "./components/pages/dashboard/dashboard.component";
import { UsersComponent } from "./components/pages/users/users.component";
import { OpportunityComponent } from "./components/pages/opportunity/opportunity.component";
import { ReportComponent } from "./components/pages/report/report.component";


const appRoutes: Routes = [
  { path: "", redirectTo: ROUTE.users, pathMatch: 'full' },
  { path: ROUTE.login, component: LoginComponent, canActivate: [RouteController] },
  { path: ROUTE.sign_up, component: RegistrationComponent, canActivate: [RouteController] },
  { path: ROUTE.activate_user, component: ActivationComponent, canActivate: [RouteController] },
  { path: ROUTE.reset_password, component: ResetPasswordComponent, canActivate: [RouteController] },
  { path: ROUTE.home, 
    component: HomeComponent, 
    canActivate: [RouteController],
    children: [
      { path: ROUTE.dashboard, component: DashboardComponent, canActivate: [RouteController] },
      { path: ROUTE.users, component: UsersComponent, canActivate: [RouteController] },
      { path: ROUTE.opportunity, component: OpportunityComponent, canActivate: [RouteController] },
      { path: ROUTE.report, component: ReportComponent, canActivate: [RouteController] },
      { path: "**", redirectTo: ROUTE.users, pathMatch: 'full' }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
    // other imports here
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
