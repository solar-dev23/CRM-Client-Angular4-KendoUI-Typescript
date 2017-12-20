import "./pages.module.less";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {ButtonsModule} from "@progress/kendo-angular-buttons";
import {InputsModule} from "@progress/kendo-angular-inputs";
import {CrmEditorModule} from "crm-platform";
import {SharedModule} from "shared";
import {AdministrationModule} from "administration";
import {LoginPageComponent} from "./login-page.component";
import {DashboardComponent} from "./dashboard.component";
import {ActivationPageComponent} from "./activation-page.component";
import {PasswordFormComponent} from  "./password-form.component";
import {RegistrationPageComponent} from "./registration-page.component";
import {ResetPasswordPageComponent} from "./reset-password-page.component";

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonsModule,
    InputsModule,
    CrmEditorModule,
    SharedModule,
    AdministrationModule,
    RouterModule
  ],
  declarations: [
    DashboardComponent,
    LoginPageComponent,
    ActivationPageComponent,
    PasswordFormComponent,
    RegistrationPageComponent,
    ResetPasswordPageComponent
  ]
})
export class PagesModule {
}