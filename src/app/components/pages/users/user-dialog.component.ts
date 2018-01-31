import { Component, ChangeDetectorRef, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ControlMessages } from '../../shared/control-messages';
import { UserService, AddressService, DEFAULT_AVATAR_IMAGE, USA_STATES } from '../../../core';
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
	@Output() close: EventEmitter<{object: any}> = new EventEmitter();

	protected base64Image: string;
  protected cropperVisible: boolean;
  protected isValidEmail: boolean;
  protected isValidPassword: boolean;
	protected isShowAlertDlg: boolean;
	protected alert_message: string;
  protected countryNames: string[];
  protected statesNames: string[];
  protected isUpdateImage: boolean;

	constructor(private userService: UserService, private addressService: AddressService) {
	}

	async ngOnInit() {
    this.countryNames = this.getCountryNameList();
    this.statesNames = this.getStatesList();

    this.user.address = new Address();
    if(this.user.address_id){
      this.user.address = await this.addressService.getById(this.user.address_id).toPromise();
    }
	}

	//Image upload
  protected onCropped(croppedInBase64): void {
    this.cropperVisible = false;
    if (croppedInBase64) {
      this.user.image = croppedInBase64;
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
    if(this.user.address_id){
      this.user.address.id = this.user.address_id;
    }

    let address = await this.addressService.save(this.user.address).toPromise();
    this.user.address_id = address.id;

  	if(this.isUpdateImage){
    	let image = await this.userService.uploadImage(this.user.image).toPromise();
    	this.user.image = image.url;
  	}

  	this.userService.save(this.user).subscribe(
  		res => {
  			this.close.emit();
  		}, err => {
        if(JSON.parse(err._body).type === "unique violation" || JSON.parse(err).type === "unique violation"){
          this.alert_message = "User name or email already exists.";
          this.isShowAlertDlg = true;
        }
  		}
  	)
  }

  protected getErrorMessage(type: string): string {
  	if (type === 'email') {
	  	let emailValidation =  ValidationService.emailValidator({value: this.user.email});
	  	if(emailValidation){
	  		this.isValidEmail = false;
	  		return 'Invalid Email Address.';
	  	} else{
	  		this.isValidEmail = true;
	  		return '';
	  	}
  	} else if (type === 'password'){
  		if (this.user.password) {
	  		let passwordValidation =  ValidationService.passwordValidator({value: this.user.password});
	  		if(passwordValidation){
		  		this.isValidPassword = false;
		  		return 'Invalid Password.';
		  	} else{
		  		this.isValidPassword = true;
		  		return '';
		  	}
  		}else {
  			this.isValidPassword = true;
  			return '';
  		}
  	} else if (type === 'confirmPassword'){
  		if(this.user.password !== this.user.confirm_password) {
  			this.isValidPassword = false;
  			return 'Does not match password.';
  		} else {
  			this.isValidPassword = true;
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
    if (e.length < 5) return;
    const location = this.zipcodeLookup(e.substr(0, 5));
    if (location) {
      this.user.address.city = location.city;
      this.user.address.state = location.state;
    }
  }

  protected countryChange(e) {
    if (e == 'United States') this.user.address.state = 'AL';
    else this.user.address.state = '';
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