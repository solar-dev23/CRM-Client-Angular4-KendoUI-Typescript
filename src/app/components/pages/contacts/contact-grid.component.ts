import { Component, ViewChild, Input } from "@angular/core";
import { Http } from "@angular/http";
import { Grid, ObjectFormGroup, ObjectGridComponent } from "crm-platform";
import { ContactService, AccountService } from "../../../core";

@Component({
  selector: "contact-grid",
  templateUrl: "./contact-grid.component.html"
})
export class ContactGridComponent {
  @ViewChild(ObjectGridComponent) gridComponent: ObjectGridComponent;

  @Input() accountList: any[];

  protected grid: Grid;
  protected formGroup: ObjectFormGroup;
  protected accountGrid: Grid;
  protected accounts: any = [];
  protected dialogGridData: any = {};

  public constructor(protected http: Http, protected contactService: ContactService, protected accountService: AccountService) {
  }

  public ngOnInit() {
    this.grid = this.contactService.getContactGrid(this.accountList);
    this.contactService.read().subscribe(res => {
      this.accountGrid = this.accountService.getAccountGrid(res);
    })
  }

  protected edit(object): void {
    this.formGroup = object ? new ObjectFormGroup(object, this.gridComponent.fields, this.http) : null;   
    if(object)
      this.accounts = object.accounts;
  }

  protected updateDialogGridData(data): void {
    this.dialogGridData = {
      accounts: data
    };
  }
}