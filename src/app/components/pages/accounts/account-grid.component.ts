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
  protected isNewDialog: boolean;
  protected customData: any = [];

  public constructor(protected http: Http, protected accountService: AccountService, protected contactService: ContactService) {
  }

  public async ngOnInit() {
    this.grid = this.accountService.getAccountGrid(this.contactList);
    this.accountService.read().subscribe(res => {
      this.contactGrid = this.contactService.getContactGrid(res);
    });
    this.customData = await this.accountService.read().toPromise();
  }

  protected edit(object): void {
    if(object){
      this.formGroup = object ? new ObjectFormGroup(object, this.gridComponent.fields, this.http) : null;
      this.contacts = object.contacts;
    }else {
      this.isNewDialog = true;
    }
  }

  protected updateDialogGridData(data): void {
    this.dialogGridData = {
      contacts: data
    };
  }

  protected async addAccount(account) {
    this.isNewDialog = false;
    this.customData = await this.accountService.read().toPromise();
  }

  protected closeDialog(): void {
    this.isNewDialog = false;
  }
}