import { Component, ViewChild, Output, EventEmitter } from "@angular/core";
import { Http } from "@angular/http";
import { Grid, ObjectFormGroup, ObjectGridComponent } from "crm-platform";
import { UserService } from "../../../core";

@Component({
  selector: "user-grid",
  templateUrl: "./user-grid.component.html"
})
export class UserGridComponent {
  @ViewChild(ObjectGridComponent) gridComponent: ObjectGridComponent;
  @Output() create: EventEmitter<any> = new EventEmitter();

  protected grid: Grid;
  protected formGroup: ObjectFormGroup;

  public constructor(protected userService: UserService, protected http: Http) {
    this.grid = userService.getUserGrid();    
  }

  protected edit(object): void {
    this.formGroup = object ? new ObjectFormGroup(object, this.gridComponent.fields, this.http) : null;
  }

  protected openCreateDialog() {
    this.create.emit();
  }
}