import { Component, ViewChild, Input } from "@angular/core";
import { Http } from "@angular/http";
import { Grid, ObjectFormGroup, ObjectGridComponent } from "crm-platform";
import { AccountService, ContactService } from "../../../core";

@Component({
  selector: "account-grid",
  templateUrl: "./account-grid.component.html"
})
export class AccountGridComponent {
  @ViewChild(ObjectGridComponent) gridComponent: ObjectGridComponent;

  @Input() contactList: any[];

  protected grid: Grid;
  protected formGroup: ObjectFormGroup;
  protected contactGrid: Grid;
  protected contacts: any = [];
  protected dialogGridData: any = {};

  public constructor(protected http: Http, protected accountService: AccountService, protected contactService: ContactService) {
  }

  public ngOnInit() {
    this.grid = this.accountService.getAccountGrid(this.contactList);
    this.accountService.read().subscribe(res => {
      this.contactGrid = this.contactService.getContactGrid(res);
    })
  }

  protected edit(object): void {
    this.formGroup = object ? new ObjectFormGroup(object, this.gridComponent.fields, this.http) : null;
    if(object)
      this.contacts = object.contacts;
  }

  protected updateDialogGridData(data): void {
    this.dialogGridData = {
      contacts: data
    };
  }
}