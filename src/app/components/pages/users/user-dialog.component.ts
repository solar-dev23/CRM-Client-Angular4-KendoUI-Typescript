import { Component, ChangeDetectorRef, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ControlMessages } from '../../shared/control-messages';
import { UserService, AddressService, RoleService, DEFAULT_AVATAR_IMAGE, USA_STATES } from '../../../core';
import { ImageCropperDialogComponent } from '../image-cropper/image-cropper.component';
import { ValidationService } from '../../shared/validation.service';
import { Address } from '../../../core/model';
import * as countriesLib from 'country-list';
const countries = countriesLib();
import * as zipcodes from 'zipcodes';

@Component({
  selector: 'user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {
	@Input() user: any;
  @Output() save: EventEmitter<{object: any}> = new EventEmitter();
	@Output() close: EventEmitter<{object: any}> = new EventEmitter();

	protected base64Image: string;
  protected image: string;
  protected cropperVisible: boolean;
  protected isFormValid: boolean;
	protected isShowAlertDlg: boolean;
	protected alert_message: string;
  protected countryNames: string[];
  protected statesNames: string[];
  protected isUpdateImage: boolean;
  protected roles: any[];
  protected isValidZipcode: boolean = true;

	constructor(private userService: UserService, private addressService: AddressService, private roleService: RoleService) {
	}

	async ngOnInit() {
    this.countryNames = this.getCountryNameList();
    this.statesNames = this.getStatesList();

    if(this.user.image) {
      this.image = this.user.image;
    }

    if(this.user.date_of_birth) {
      this.user.date_of_birth = new Date(this.user.date_of_birth);
    }else {
      this.user.date_of_birth = new Date();
    }

    if(this.user.hire_date) {
      this.user.hire_date = new Date(this.user.hire_date);
    }else {
      this.user.hire_date = new Date();
    }

    if(this.user.termination_date) {
      this.user.termination_date = new Date(this.user.termination_date);
    }else {
      this.user.termination_date = new Date();
    }

    this.user.address = new Address();
    if(this.user.address_id){
      this.user.address = await this.addressService.getById(this.user.address_id).toPromise();
    }

    this.roles = await this.roleService.read().toPromise();
console.log("ROLES:", this.roles);
    if(this.user.roles){
console.log("USER ROLES:", this.user.roles);
      this.user.role = this.roles.find(role => role.id === this.user.roles[0].id);
    }else {
      this.user.roles = [];
      this.user.role = this.roles[1];
    }
console.log("USER ROLE:", this.user.role);
console.log("USER Name", this.user.username);
console.log("USER Password", this.user.password);
console.log("USER OBJECT", this.user);
	}

	//Image upload
  protected onCropped(croppedInBase64): void {
    this.cropperVisible = false;
    if (croppedInBase64) {
      this.image = croppedInBase64;
      this.isUpdateImage = true;
    }
  }

  protected onProfileImgClick(e): void {
    document.getElementById("card-upload-input").click();
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
      that.cropperVisible = true;
    };
    myReader.readAsDataURL(file);
  }

  protected async onFormSubmit(userForm: any) {
    this.isFormValid = false;
    if(this.user.address_id){
      this.user.address.id = this.user.address_id;
    }

    let address = await this.addressService.save(this.user.address).toPromise();
    this.user.address_id = address.id;

  	if(this.isUpdateImage){
    	let image = await this.userService.uploadImage(this.image).toPromise();
    	this.user.image = image.url;
  	}

    this.user.roles[0] = {id:this.user.role.id};

  	this.userService.save(this.user).subscribe(
  		res => {
  			this.save.emit(res);
        this.isFormValid = true;
  		}, err => {
        // if(JSON.parse(err._body).type === "unique violation" || JSON.parse(err).type === "unique violation"){
        //   this.alert_message = "User name or email already exists.";
        //   this.isShowAlertDlg = true;
        // }

  			// if(JSON.parse(err._body).error.message || JSON.parse(err).error.message){
     //      this.alert_message = "User with this name or email is already exist";
     //      this.isShowAlertDlg = true;
     //    }
        this.alert_message = "User with this name or email is already exist";
        this.isShowAlertDlg = true;
  		}
  	)
  }

  protected getErrorMessage(type: string): string {
  	if (type === 'email') {
	  	let emailValidation =  ValidationService.emailValidator({value: this.user.email});
	  	if(emailValidation){
	  		this.isFormValid = false;
	  		return 'Invalid Email Address.';
	  	} else{
	  		this.isFormValid = true;
	  		return '';
	  	}
  	} else if (type === 'password'){
  		if (this.user.password) {
	  		let passwordValidation =  ValidationService.passwordValidator({value: this.user.password});
	  		if(passwordValidation){
		  		this.isFormValid = false;
		  		return passwordValidation;
		  	} else{
		  		this.isFormValid = true;
		  		return '';
		  	}
  		}else {
  			this.isFormValid = true;
  			return '';
  		}
  	} else if (type === 'confirmPassword'){
  		if(this.user.password !== this.user.confirm_password) {
  			this.isFormValid = false;
  			return 'Does not match password.';
  		} else {
  			this.isFormValid = true;
  			return '';
  		}
  	}else if (type === 'phone') {
      let phoneValidation =  ValidationService.phoneValidator({value: this.user.phone});
      if(phoneValidation){
        this.isFormValid = false;
        return 'Invalid Phone Number.';
      } else{
        this.isFormValid = true;
        return '';
      }
    }else if (type === 'zipcode') {
      if(!this.isValidZipcode){
        this.isFormValid = false;
        return 'Invalid Zipcode.';
      } else{
        this.isFormValid = true;
        return '';
      }
    }
  }

  protected onCloseDialog() {
  	this.close.emit();
  }

  protected updateDisplayName(): void {
  	this.user.displayName = this.user.firstName + ' ' + this.user.lastName;
  }

  protected changeZipcode(e) {
    if(e.length === 0){
      this.isValidZipcode = true;
      return;
    }else if (0 < e.length && e.length < 5){
      if(this.user.address.country === 'United States')
        this.isValidZipcode = false;
      else
        this.isValidZipcode = true;

      return;
    }

    const location = this.zipcodeLookup(e);
    if (location) {
      this.user.address.country = 'United States';
      this.user.address.city = location.city;
      this.user.address.state = location.state;
      this.isValidZipcode = true;
    } else {
      if(this.user.address.country === 'United States'){
        this.isValidZipcode = false;
      }else {
        this.user.address.city = '';
        this.user.address.state = '';
        this.isValidZipcode = true;
      }
    }
  }

  protected countryChange(e) {
    if (e == 'United States') {
      this.user.address.state = 'AL';
      this.user.address.city = '';
      this.user.address.zip = '';
    } else{
      this.user.address.state = '';
      this.user.address.city = '';
      this.user.address.zip = '';
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
}