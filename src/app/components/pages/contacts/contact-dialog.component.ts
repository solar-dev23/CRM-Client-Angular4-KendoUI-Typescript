import { Component, EventEmitter, Output, Input } from "@angular/core";
import { Grid } from "crm-platform";
import { ContactService, AccountService, AddressService, USA_STATES } from "../../../core";
import { Contact, SocialNetwork, Address } from '../../../core/model';
import * as countriesLib from 'country-list';
const countries = countriesLib();
import * as zipcodes from 'zipcodes';

@Component({
  selector: "contact-dialog",
  templateUrl: "./contact-dialog.component.html",
  styleUrls: ["./contact-dialog.component.scss"]
})
export class ContactDialogComponent {
  @Input() contact: Contact = new Contact(); 

	@Output() save: EventEmitter<{object: any}> = new EventEmitter();
	@Output() cancel: EventEmitter<any> = new EventEmitter();

  protected accountGrid: Grid;
  protected accounts: any = [];
  protected dialogGridData: any = {};
  protected address: Address = new Address();
  protected socialNetwork: SocialNetwork = new SocialNetwork();

	public constructor(
		private contactService: ContactService,
    private accountService: AccountService,
    private addressService: AddressService
	) {
  }

  async ngOnInit() {
    let contactList = await this.contactService.read().toPromise();
    this.accountGrid = await this.accountService.getAccountGrid(contactList);
  }

  protected async onFormSubmit(contactForm: any) {
console.log(contactForm);
    if(this.contact.address_id !== ''){
      this.address.id = this.contact.address_id;
    }

    let address = await this.addressService.save(this.address).toPromise();
    this.contact.address_id = address.id;

    // this.contactService.save(contactForm).subscribe(
    //   res => {
    //     this.save.emit(res);
    //   }
    // )
  }

  protected onClose() {
  	this.cancel.emit();
  }

  protected updateDialogGridData(data): void {
    this.dialogGridData = {
      accounts: data
    };
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