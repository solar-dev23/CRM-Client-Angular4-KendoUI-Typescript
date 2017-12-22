import "./pages.module.less";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { CrmEditorModule, CrmGridModule, CrmDialogModule } from "crm-platform";

import { SharedModule } from "../shared";
import { LoginComponent } from "./login/login.component";
// import { DashboardComponent } from "./dashboard/dashboard.component";
import { ActivationComponent } from "./activation/activation.component";
import { PasswordFormComponent } from  "./password-form/password-form.component";
import { RegistrationComponent } from "./registration/registration.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { UsersComponent } from "./users/users.component";
import { UserGridComponent } from "./users/user-grid.component";
import { MenuComponent } from './menu/menu.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OpportunityComponent } from './opportunity/opportunity.component';
import { ChartComponent } from './dashboard/chart/chart.component';
import { ChartLegendComponent } from './dashboard/chart-legend/chart-legend.component';
import { ChartTwoComponent } from './dashboard/chart-two/chart-two.component';
import { ReportComponent } from './report/report.component';
import { ReportPrintComponent } from './report/print/print.component';
import { ReportGridComponent } from './report/grid/grid.component';
import { ReportChartComponent } from './report/chart/chart.component';
import { ReportChartLegendComponent } from './report/chart-legend/chart-legend.component';
import { ReportChartTwoComponent } from './report/chart-two/chart-two.component';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonsModule,
    InputsModule,
    CrmEditorModule,
    CrmGridModule,
    CrmDialogModule,
    SharedModule,
    RouterModule
  ],
  declarations: [
    // DashboardComponent,
    LoginComponent,
    ActivationComponent,
    PasswordFormComponent,
    RegistrationComponent,
    ResetPasswordComponent,
    UsersComponent,
    UserGridComponent,
    MenuComponent,
    HeaderComponent,
    DashboardComponent,
    ChartComponent,
    ChartLegendComponent,
    ChartTwoComponent,
    OpportunityComponent,
    ReportComponent,
    ReportPrintComponent,
    ReportGridComponent,
    ReportChartComponent,
    ReportChartLegendComponent,
    ReportChartTwoComponent
  ]
})
export class PagesModule {
}