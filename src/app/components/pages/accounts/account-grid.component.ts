import { Component, ViewChild } from "@angular/core";
import { Http } from "@angular/http";
import { Grid, ObjectFormGroup, ObjectGridComponent } from "crm-platform";
import { AccountService } from "../../../core";

@Component({
  selector: "account-grid",
  templateUrl: "./account-grid.component.html"
})
export class AccountGridComponent {
  @ViewChild(ObjectGridComponent) gridComponent: ObjectGridComponent;

  protected grid: Grid;
  protected formGroup: ObjectFormGroup;

  public constructor(protected accountService: AccountService, protected http: Http) {
    this.grid = accountService.getAccountGrid();
  }

  protected edit(object): void {
    this.formGroup = object ? new ObjectFormGroup(object, this.gridComponent.fields, this.http) : null;
  }
}