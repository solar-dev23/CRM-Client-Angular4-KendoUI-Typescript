import { Component, EventEmitter, Output, Input } from "@angular/core";
import { Grid } from "crm-platform";
import { ContactService, AccountService, AddressService, SocialNetworkService, DepartmentService, USA_STATES } from "../../../core";
import { Contact, SocialNetwork, Address } from '../../../core/model';
import { ValidationService } from '../../shared/validation.service';
import * as countriesLib from 'country-list';
const countries = countriesLib();
import * as zipcodes from 'zipcodes';

@Component({
  selector: "contact-dialog",
  templateUrl: "./contact-dialog.component.html",
  styleUrls: ["./contact-dialog.component.scss"]
})
export class ContactDialogComponent {
  @Input() contact: any;

	@Output() save: EventEmitter<{object: any}> = new EventEmitter();
	@Output() cancel: EventEmitter<any> = new EventEmitter();

  protected accountGrid: Grid;
  // protected accounts: any = [];
  protected dialogGridData: any = {};
  protected address: any;
  protected socialNetwork: any;
  protected accountList: any;
  protected isShowGrid: boolean;
  protected departmentList: any = [];
  protected isValidEmail: boolean = true;
  protected isValidPhone: boolean = true;
  protected isValidFax: boolean = true;
  protected isValidMobile: boolean = true;
  protected isValidZipcode: boolean = true;
  protected countryNames: string[];
  protected statesNames: string[];
  protected isDisabled: boolean;

	public constructor(
		private contactService: ContactService,
    private accountService: AccountService,
    private addressService: AddressService,
    private socialNetworkService: SocialNetworkService,
    private departmentService: DepartmentService
	) {
  }

  async ngOnInit() {
    this.countryNames = this.getCountryNameList();
    this.statesNames = this.getStatesList();

    this.address = new Address();
    this.socialNetwork = new SocialNetwork();

    if(this.contact.address_id){
      this.address = await this.addressService.getById(this.contact.address_id).toPromise();
    }

    if(this.contact.social_network_id){
      this.socialNetwork = await this.socialNetworkService.getById(this.contact.social_network_id).toPromise();
    }

    let contactList = await this.contactService.read().toPromise();
    this.accountGrid = this.accountService.getAccountGrid(contactList);
    this.accountList = await this.accountService.read().toPromise();

    let that = this;
    if(this.contact.accounts.length>0) {
      this.contact.accounts.forEach(function(cAccount, i) {
        let index = that.accountList.findIndex(account => account.id === cAccount.id);
        if(index > -1)
          that.contact.accounts[i] = that.accountList[index];
      })
    }

    this.departmentList = await this.departmentService.read().toPromise();
    this.isShowGrid = true;
  }

  protected async onFormSubmit(contactForm: any) {
    this.isDisabled = true;
    if(this.contact.address_id){
      this.address.id = this.contact.address_id;
    }else {
      delete this.address.id;
    }
    let address = await this.addressService.save(this.address).toPromise();
    this.contact.address_id = address.id;

    if(this.contact.social_network_id){
      this.socialNetwork.id = this.contact.social_network_id;
    }else {
      delete this.socialNetwork['id'];
    }  
    let socialNetwork = await this.socialNetworkService.save(this.socialNetwork).toPromise();
    this.contact.social_network_id = socialNetwork.id;

    this.contactService.save(this.contact).subscribe(
      res => {
        this.save.emit(res);
        this.isDisabled = false;
      }
    )
  }

  protected onClose() {
  	this.cancel.emit();
  }

  protected updateDialogGridData(data): void {    
    this.contact.accounts = data;
  }

  protected changeZipcode(e) {
    if(e.length === 0){
      this.isValidZipcode = true;
      return;
    }else if (0 < e.length && e.length < 5){
      if(this.address.country === 'United States')
        this.isValidZipcode = false;
      else
        this.isValidZipcode = true;

      return;
    }

    const location = this.zipcodeLookup(e);
    if (location) {
      this.address.country = 'United States';
      this.address.city = location.city;
      this.address.state = location.state;
      this.isValidZipcode = true;
    } else {
      if(this.address.country === 'United States'){
        this.isValidZipcode = false;
      }else {
        this.address.city = '';
        this.address.state = '';
        this.isValidZipcode = true;
      }
    }
  }

  protected countryChange(e) {
    if (e == 'United States') {
      this.address.state = 'AL';
      this.address.city = '';
      this.address.zip = '';
    } else{
      this.address.state = '';
      this.address.city = '';
      this.address.zip = '';
      this.isValidZipcode = true;
    }
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

  protected updateDisplayName(): void {
    this.contact.displayName = this.contact.firstName + ' ' + this.contact.lastName;
  }

  protected getErrorMessage(type: string): string {
    if (type === 'email') {
      let emailValidation =  ValidationService.emailValidator({value: this.contact.email});
      if(emailValidation){
        this.isValidEmail = false;
        return 'Invalid Email Address.';
      } else{
        this.isValidEmail = true;
        return '';
      }
    }else if (type === 'phone') {
      let phoneValidation =  ValidationService.phoneValidator({value: this.contact.phone});
      if(phoneValidation){
        this.isValidPhone = false;
        return 'Invalid Phone Number.';
      } else{
        this.isValidPhone = true;
        return '';
      }
    }else if (type === 'fax') {
      let faxValidation =  ValidationService.phoneValidator({value: this.contact.fax});
      if(faxValidation){
        this.isValidFax = false;
        return 'Invalid Fax.';
      } else{
        this.isValidFax = true;
        return '';
      }
    }else if (type === 'mobile') {
      let mobileValidation =  ValidationService.phoneValidator({value: this.contact.mobile});
      if(mobileValidation){
        this.isValidMobile = false;
        return 'Invalid Mobile.';
      } else{
        this.isValidMobile = true;
        return '';
      }
    }else if (type === 'zipcode') {
      if(!this.isValidZipcode){
        return 'Invalid Zipcode.';
      } else{
        return '';
      }
    }
  }
}