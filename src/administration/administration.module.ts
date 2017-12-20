import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {CrmDialogModule, CrmEditorModule, CrmGridModule} from "crm-platform";
import {UserGridComponent} from "./user-grid.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CrmGridModule,
    CrmEditorModule,
    CrmDialogModule,
  ],
  declarations: [
    UserGridComponent,
  ],
  exports: [
    UserGridComponent
  ]
})
export class AdministrationModule {
}