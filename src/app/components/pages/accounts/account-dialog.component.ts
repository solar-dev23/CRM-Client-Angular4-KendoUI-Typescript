import { Component, EventEmitter, Output, Input } from "@angular/core";
import { Grid } from "crm-platform";
import { ContactService, AccountService, AddressService, SocialNetworkService, USA_STATES } from "../../../core";
import { Contact, SocialNetwork, Address } from '../../../core/model';
import * as countriesLib from 'country-list';
const countries = countriesLib();
import * as zipcodes from 'zipcodes';

@Component({
  selector: "account-dialog",
  templateUrl: "./account-dialog.component.html",
  styleUrls: ["./account-dialog.component.scss"]
})
export class AccountDialogComponent {
  @Input() account: any;

	@Output() save: EventEmitter<{object: any}> = new EventEmitter();
	@Output() cancel: EventEmitter<any> = new EventEmitter();

  protected contactGrid: Grid;
  // protected accounts: any = [];
  protected dialogGridData: any = {};
  protected address: any;
  protected socialNetwork: any;
  protected contactList: any;
  protected isShowGrid: boolean;

	public constructor(
		private contactService: ContactService,
    private accountService: AccountService,
    private addressService: AddressService,
    private socialNetworkService: SocialNetworkService
	) {
  }

  async ngOnInit() {
    this.address = new Address();
    this.socialNetwork = new SocialNetwork();

    if(this.account.address_id){
      this.address = await this.addressService.getById(this.account.address_id).toPromise();
    }

    if(this.account.social_network_id){
      this.socialNetwork = await this.socialNetworkService.getById(this.account.social_network_id).toPromise();
    }

    let accountList = await this.accountService.read().toPromise();
    this.contactGrid = this.contactService.getContactGrid(accountList);
    this.contactList = await this.contactService.read().toPromise();

    let that = this;
    if(this.account.contacts.length>0) {
      this.account.contacts.forEach(function(cAccount, i) {
        let index = that.contactList.findIndex(account => account.id === cAccount.id);
        if(index > -1)
          that.account.contacts[i] = that.contactList[index];
      })
    }

    this.isShowGrid = true;
  }

  protected onFormSubmit(accountForm: any) {
    this.accountService.save(accountForm).subscribe(
      res => {
        this.save.emit(res);
      }
    )
  }

  protected onClose() {
  	this.cancel.emit();
  }

  protected updateDialogGridData(data): void {
    this.account.contacts = data;
  }

  protected changeZipcode(e) {
    if (e.length < 5) return;
    const location = this.zipcodeLookup(e.substr(0, 5));
    if (location) {
      this.address.city = location.city;
      this.address.state = location.state;
    }
  }

  protected countryChange(e) {
    if (e == 'United States') this.address.state = 'AL';
    else this.address.state = '';
  }

  protected zipcodeLookup(code) {
    return zipcodes.lookup(code);
  }

  protected getStatesList() {
    return USA_STATES.map(e => e.abbreviation);
  }

  protected getCountryNameList() {
    return countries.getNames();
  }
}