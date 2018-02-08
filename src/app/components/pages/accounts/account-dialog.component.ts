import { Component, EventEmitter, Output, Input } from "@angular/core";
import { Grid } from "crm-platform";
import { ContactService, AccountService, AddressService, SocialNetworkService, USA_STATES, ACCOUNT_TYPES } from "../../../core";
import { Contact, SocialNetwork, Address } from '../../../core/model';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
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
  protected base64Image: string;
  protected account_type_options: IMultiSelectOption[] = ACCOUNT_TYPES;
  protected account_type_settings: IMultiSelectSettings = {
      enableSearch: false,
      checkedStyle: 'fontawesome',
      buttonClasses: 'btn btn-default btn-block',
      dynamicTitleMaxItems: 3,
      displayAllSelectedText: true
  };
  protected account_type_texts: IMultiSelectTexts = {
      checkAll: 'Select all',
      uncheckAll: 'Unselect all',
      checked: 'item selected',
      checkedPlural: 'items selected',
      searchPlaceholder: 'Find',
      searchEmptyResult: 'Nothing found...',
      searchNoRenderText: 'Type in search box to see results...',
      defaultTitle: 'Select',
      allSelected: 'All selected',
  };
  protected isValidZipcode: boolean = true;
  protected countryNames: string[];
  protected statesNames: string[];
  protected isDisabled: boolean;

	public constructor(
		private contactService: ContactService,
    private accountService: AccountService,
    private addressService: AddressService,
    private socialNetworkService: SocialNetworkService
	) {
  }

  async ngOnInit() {
    this.countryNames = this.getCountryNameList();
    this.statesNames = this.getStatesList();

    this.address = new Address();
    this.socialNetwork = new SocialNetwork();

    if(this.account.physical_address_id){
      this.address = await this.addressService.getById(this.account.physical_address_id).toPromise();
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

    if(this.account.account_type && this.account.account_type !== ''){
      this.account.account_type = this.account.account_type.split(',');
      this.account.account_type.forEach(function(type, i) {
        that.account.account_type[i] = parseInt(type);
      })
    }else {
      this.account.account_type = null;
    }
    this.isShowGrid = true;
  }

  protected fileChangeListener($event) {
    this.base64Image = undefined;
    let image: any = new Image();
    let file: File = $event.target.files[0];
    let myReader: FileReader = new FileReader();
    let that = this;
    myReader.onloadend = function (loadEvent: any) {
      image.src = loadEvent.target.result;
      that.base64Image = image.src;
    };
    myReader.readAsDataURL(file);
  }

  protected async onFormSubmit(accountForm: any) {
    this.isDisabled = true;
    if(this.account.physical_address_id){
      this.address.id = this.account.physical_address_id;
    }else {
      delete this.address.id;
    }
    let address = await this.addressService.save(this.address).toPromise();
    this.account.physical_address_id = address.id;

    if(this.account.social_network_id){
      this.socialNetwork.id = this.account.social_network_id;
    }else {
      delete this.socialNetwork['id'];
    }  
    let socialNetwork = await this.socialNetworkService.save(this.socialNetwork).toPromise();
    this.account.social_network_id = socialNetwork.id;

    if(this.base64Image){
      let document = await this.accountService.uploadDocument(this.base64Image).toPromise();
      this.account.document = document.url;
    }

    this.account.account_type = this.account.account_type.toString();
    this.accountService.save(this.account).subscribe(
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
    this.account.contacts = data;
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
    this.account.displayName = this.account.companyName;
  }

  protected getErrorMessage(type: string): string {
    if (type === 'zipcode') {
      if(!this.isValidZipcode){
        return 'Invalid Zipcode.';
      } else{
        return '';
      }
    }
  }
}