import { Component, ViewChild } from "@angular/core";
import { Http } from "@angular/http";
import { Grid, ObjectFormGroup, ObjectGridComponent } from "crm-platform";
import { ContactService } from "../../../core";

@Component({
  selector: "contact-grid",
  templateUrl: "./contact-grid.component.html"
})
export class ContactGridComponent {
  @ViewChild(ObjectGridComponent) gridComponent: ObjectGridComponent;

  protected grid: Grid;
  protected formGroup: ObjectFormGroup;

  public constructor(protected contactService: ContactService, protected http: Http) {
    this.grid = contactService.getContactGrid();
  }

  protected edit(object): void {
    this.formGroup = object ? new ObjectFormGroup(object, this.gridComponent.fields, this.http) : null;
  }
}