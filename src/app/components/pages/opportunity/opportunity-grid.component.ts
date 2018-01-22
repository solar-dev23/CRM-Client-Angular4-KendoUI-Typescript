import { Component, ViewChild, Input } from "@angular/core";
import { Http } from "@angular/http";
import { Grid, ObjectFormGroup, ObjectGridComponent } from "crm-platform";
import { OpportunityService } from "../../../core";

@Component({
  selector: "opportunity-grid",
  templateUrl: "./opportunity-grid.component.html"
})
export class OpportunityGridComponent {
  @ViewChild(ObjectGridComponent) gridComponent: ObjectGridComponent;
  @Input() contactList: any = [];
  @Input() accountList: any = [];
  @Input() statusList: any = [];

  protected grid: Grid;
  protected formGroup: ObjectFormGroup;

  public constructor(
    protected opportunityService: OpportunityService,
    protected http: Http
  ) {
  }

  public ngOnInit() {
    this.grid = this.opportunityService.getOpportunityGrid(this.contactList, this.accountList, this.statusList);
  }

  protected edit(object): void {
    this.formGroup = object ? new ObjectFormGroup(object, this.gridComponent.fields, this.http) : null;
  }
}