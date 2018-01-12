import { Component, ViewChild } from "@angular/core";
import { Http } from "@angular/http";
import { Grid, ObjectFormGroup, ObjectGridComponent, ObjectGrid2Component } from "crm-platform";
import { ContactService, AccountService } from "../../../core";

@Component({
  selector: "contact-grid",
  templateUrl: "./contact-grid.component.html"
})
export class ContactGridComponent {
  @ViewChild(ObjectGridComponent) gridComponent: ObjectGridComponent;

  protected grid: Grid;
  protected formGroup: ObjectFormGroup;
  protected accountGrid: Grid;

  public constructor(protected http: Http, protected contactService: ContactService, protected accountService: AccountService) {
    this.grid = contactService.getContactGrid();
    this.accountGrid = accountService.getAccountGrid();
    
  }

  protected edit(object): void {
    this.formGroup = object ? new ObjectFormGroup(object, this.gridComponent.fields, this.http) : null;
  }
}