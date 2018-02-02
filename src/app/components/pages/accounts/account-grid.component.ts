import { Component, ViewChild, Input } from "@angular/core";
import { Http } from "@angular/http";
import { Grid, ObjectFormGroup, ObjectGridComponent } from "crm-platform";
import { AccountService, ContactService } from "../../../core";
import { Account } from '../../../core/model';

@Component({
  selector: "account-grid",
  templateUrl: "./account-grid.component.html"
})
export class AccountGridComponent {
  @ViewChild(ObjectGridComponent) gridComponent: ObjectGridComponent;

  @Input() contactList: any[];

  protected account: any;
  protected grid: Grid;
  protected formGroup: ObjectFormGroup;
  protected contactGrid: Grid;
  protected dialogGridData: any = {};
  protected isShowDialog: boolean;
  protected customData: any = [];

  public constructor(protected http: Http, protected accountService: AccountService, protected contactService: ContactService) {
    this.account = new Account();
  }

  public async ngOnInit() {
    this.grid = this.accountService.getAccountGrid(this.contactList);
    this.accountService.read().subscribe(res => {
      this.contactGrid = this.contactService.getContactGrid(res);
    });
    this.customData = await this.accountService.read().toPromise();
  }

  protected edit(event): void {
    let account = event.object;
    if(account){
      this.account = account;
      this.isShowDialog = true;
    }
  }

  protected create(): void {
    this.account = new Account();
    this.isShowDialog = true;
  }

  protected async addAccount(account) {
    this.isShowDialog = false;
    this.customData = await this.accountService.read().toPromise();
  }

  protected closeDialog(): void {
    this.isShowDialog = false;
  }
}