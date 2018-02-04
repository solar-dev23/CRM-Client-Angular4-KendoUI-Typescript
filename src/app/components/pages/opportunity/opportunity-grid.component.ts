import { Component, ViewChild, Input } from "@angular/core";
import { Http } from "@angular/http";
import { Grid, ObjectFormGroup, ObjectGridComponent } from "crm-platform";
import { OpportunityService } from "../../../core";
import { Opportunity } from '../../../core/model';

@Component({
  selector: "opportunity-grid",
  templateUrl: "./opportunity-grid.component.html"
})
export class OpportunityGridComponent {
  @ViewChild(ObjectGridComponent) gridComponent: ObjectGridComponent;
  @Input() contactList: any = [];
  @Input() accountList: any = [];
  @Input() statusList: any = [];
  @Input() customData: any = [];

  protected grid: Grid;
  protected formGroup: ObjectFormGroup;
  protected isShowDialog: boolean;
  protected opportunity: any;

  public constructor(
    protected opportunityService: OpportunityService,
    protected http: Http
  ) {
  }

  public ngOnInit() {
    this.grid = this.opportunityService.getOpportunityGrid(this.contactList, this.accountList, this.statusList);
  }

  protected create(): void {
    this.opportunity = new Opportunity();
    this.isShowDialog = true;
  }

  protected edit(event): void {    
    let opportunity = event.object;
    if(opportunity){
      this.opportunity = opportunity;
      this.isShowDialog = true;
    }
    // this.formGroup = object ? new ObjectFormGroup(object, this.gridComponent.fields, this.http) : null;
  }

  protected closeDialog(): void {
    this.isShowDialog = false;
  }
}