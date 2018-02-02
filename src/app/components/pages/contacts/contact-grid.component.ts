import { Component, ViewChild, Input } from "@angular/core";
import { Http } from "@angular/http";
import { Grid, ObjectFormGroup, ObjectGridComponent } from "crm-platform";
import { ContactService, AccountService } from "../../../core";
import { Contact } from '../../../core/model';

@Component({
  selector: "contact-grid",
  templateUrl: "./contact-grid.component.html"
})
export class ContactGridComponent {
  @ViewChild(ObjectGridComponent) gridComponent: ObjectGridComponent;

  @Input() accountList: any[];

  protected contact: any;
  protected grid: Grid;
  protected formGroup: ObjectFormGroup;
  protected accountGrid: Grid;
  protected dialogGridData: any = {};
  protected isShowDialog: boolean;
  protected customData: any = [];

  public constructor(protected http: Http, protected contactService: ContactService, protected accountService: AccountService) {
    this.contact = new Contact();
  }

  public async ngOnInit() {
    this.grid = this.contactService.getContactGrid(this.accountList);
    this.contactService.read().subscribe(res => {
      this.accountGrid = this.accountService.getAccountGrid(res);
    });
    this.customData = await this.contactService.read().toPromise();
  }

  protected edit(event): void {
    let contact = event.object;
    if(contact){
      this.contact = contact;
      this.isShowDialog = true;
    }
  }

  protected create(): void {
    this.contact = new Contact();
    this.isShowDialog = true;
  }

  protected async addContact(contact) {
    this.isShowDialog = false;
    this.customData = await this.contactService.read().toPromise();
  }

  protected closeDialog(): void {
    this.isShowDialog = false;
  }
}