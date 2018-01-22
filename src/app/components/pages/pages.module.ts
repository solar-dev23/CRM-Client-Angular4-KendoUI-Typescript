import "./pages.module.less";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule, DatePipe } from "@angular/common";
import { RouterModule } from "@angular/router";
import { DndModule } from 'ng2-dnd';
import { LocalStorageModule } from 'angular-2-local-storage';
import { CrmEditorModule, CrmGridModule, CrmDialogModule } from "crm-platform";
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { NgxPaginationModule } from 'ngx-pagination';
import { ImageCropperComponent, CropperSettings, ImageCropperModule } from 'ng2-img-cropper';

// Kendo UI modules
import { ChartsModule } from '@progress/kendo-angular-charts';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
// import { GridModule, PDFModule, ExcelModule } from '@progress/kendo-angular-grid';
import { PopupModule } from '@progress/kendo-angular-popup';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DatePickerModule, DateInputsModule } from '@progress/kendo-angular-dateinputs';

// Application
import { SharedModule } from "../shared";
import { LoginComponent } from "./login/login.component";
import { ActivationComponent } from "./activation/activation.component";
import { PasswordFormComponent } from  "./password-form/password-form.component";
import { RegistrationComponent } from "./registration/registration.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { HomeComponent } from "./home.component";
import { UsersComponent } from "./users/users.component";
import { UserGridComponent } from "./users/user-grid.component";
import { UserCardComponent } from "./users/user-card.component";
import { MenuComponent } from './menu/menu.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OpportunityComponent } from './opportunity/opportunity.component';
import { OpportunityGridComponent } from './opportunity/opportunity-grid.component';
import { OpportunityDialogComponent } from './opportunity/opportunity-dialog.component';
import { ChartComponent } from './dashboard/chart/chart.component';
import { ChartLegendComponent } from './dashboard/chart-legend/chart-legend.component';
import { ChartTwoComponent } from './dashboard/chart-two/chart-two.component';
import { ReportComponent } from './report/report.component';
import { ReportPrintComponent } from './report/print/print.component';
import { ReportGridComponent } from './report/grid/grid.component';
import { ReportChartComponent } from './report/chart/chart.component';
import { ReportChartLegendComponent } from './report/chart-legend/chart-legend.component';
import { ReportChartTwoComponent } from './report/chart-two/chart-two.component';
import { ImageCropperDialogComponent } from './image-cropper/image-cropper.component';
import { ControlMessages } from '../shared/control-messages';
import { ContactsComponent } from "./contacts/contacts.component";
import { ContactGridComponent } from "./contacts/contact-grid.component";
import { AccountsComponent } from "./accounts/accounts.component";
import { AccountGridComponent } from "./accounts/account-grid.component";

import { GridModule, PDFModule, ExcelModule } from '../../libs/kendo-angular-grid/dist/es/main';

import { SharedService } from './report/shared.service';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CrmEditorModule,
    CrmGridModule,
    CrmDialogModule,
    SharedModule,
    RouterModule,
    DndModule.forRoot(),
    LocalStorageModule.withConfig({
        prefix: 'drag-drop',
        storageType: 'localStorage'
    }),
    MultiselectDropdownModule,
    NgxPaginationModule,
    ImageCropperModule,

    // Register the modules
    // Kendo UI
    ButtonsModule,
    ChartsModule,
    GridModule,
    PDFModule,
    ExcelModule,
    DatePickerModule,
    DropDownsModule,
    PopupModule,
    DialogModule,
    InputsModule,
    DateInputsModule
  ],
  declarations: [
    LoginComponent,
    ActivationComponent,
    PasswordFormComponent,
    RegistrationComponent,
    ResetPasswordComponent,
    HomeComponent,
    UsersComponent,
    UserGridComponent,
    UserCardComponent,
    MenuComponent,
    HeaderComponent,
    DashboardComponent,
    ChartComponent,
    ChartLegendComponent,
    ChartTwoComponent,
    OpportunityComponent,
    OpportunityGridComponent,
    OpportunityDialogComponent,
    ReportComponent,
    ReportPrintComponent,
    ReportGridComponent,
    ReportChartComponent,
    ReportChartLegendComponent,
    ReportChartTwoComponent,
    ImageCropperDialogComponent,
    ControlMessages,
    ContactsComponent,
    ContactGridComponent,
    AccountsComponent,
    AccountGridComponent
  ],
  providers: [SharedService, DatePipe]
})
export class PagesModule {
}