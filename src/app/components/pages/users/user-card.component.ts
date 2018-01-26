import { Component, ChangeDetectorRef, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ControlMessages } from '../../shared/control-messages';
import { UserService, DEFAULT_AVATAR_IMAGE } from '../../../core';
import { ImageCropperDialogComponent } from '../image-cropper/image-cropper.component';
import { ValidationService } from '../../shared/validation.service';

@Component({
  selector: 'user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {
	@Input() isOpenedDialog: boolean;

	protected users: Array<any>;
	protected user: any;
	protected page: any = {
			take: 20, 
			skip: 1, 
			totals: 0, 
			IsActive: null
	};
	protected	menuColors: Array<string> = [
			"#fbf8f8",
			"yellow",
			"#ffcc00",
			"#00ffff",
			"#66ffcc",
			"#e2dede"
	];
	protected isConfirmDelete: boolean = false;
	protected deleteItem: any;
	protected isPagingHide: boolean = true;
  protected base64Image: string;
  protected cropperVisible: boolean;
  protected isValidEmail: boolean;
  protected isValidPassword: boolean;

	constructor(private userService: UserService) {
	}

	public ngOnInit() {
		this._getUserList();
		this.user = {
			firstName: '',
			lastName: '',
			displayName: '',
			email: '',
			username: '',
			password: '',
			confirm_password:'',
			image: DEFAULT_AVATAR_IMAGE
		}
	}

	private async _getUserList() {
		this.users = await this.userService.read().toPromise();
		this.users = this.users.filter(user => {
			if(!user.image || user.image === ''){
				user.image = DEFAULT_AVATAR_IMAGE;
			}

			return user;
		});
	}
	
	protected onCloseDialog() {
	  this.isOpenedDialog = false;
	  this._clearForm();
	}

	private _clearForm(){
		this.user = {
			firstName: '',
			lastName: '',
			displayName: '',
			email: '',
			username: '',
			password: '',
			confirm_password:'',
			image: DEFAULT_AVATAR_IMAGE
		}    	
	}

	//Show menu
	public showMenu(e): void {
		if(e.target.tagName=="SPAN")
			e.target.parentElement.getElementsByClassName("card-menu")[0].style.display="block";
		else
			e.target.parentElement.parentElement.getElementsByClassName("card-menu")[0].style.display="block";
	}
	//Menu mouse over leave event
	public menuLeave(e): void {
		e.fromElement.style.display="none";
	}
	//Parent component search click
	public onSearch(e): void {
		console.log("Parent event=>",e);
	}
	
	//Edit user	
	protected onEdit(user): void {
		this.user = user;
		if(!this.user.image || this.user.image == '')
			this.user.image = DEFAULT_AVATAR_IMAGE;

		this.isOpenedDialog = true;
	}

	public openDeleteDialog(user): void {
		this.deleteItem = user;
		this.isConfirmDelete = true;
	}

	public onDelete() {
		this.userService.remove(this.deleteItem).subscribe(async (res) => {
			this._getUserList();
			this.isConfirmDelete = false;
		})
	}

	// //Page selection changes
	// public pageChange(e): any {
	// 	this.page.skip = e;
	// 	this.LoadDataList();
	// 	console.log("Pagingi=> ",e);
	// }

	// public jumpFirst(e):void {
	// 	e.pageChange.emit(1);
	// }

	// public jumpLast(e):void {
	// 	//this.page.skip= Math.ceil(this.page.totals/this.page.take);
	// 	e.pageChange.emit(Math.ceil(this.page.totals/this.page.take))
	// }

	//Image upload
  protected onCropped(croppedInBase64): void {
    this.cropperVisible = false;
    if (croppedInBase64) {
      this.user.image = croppedInBase64;
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
  	if(this.user.image !== DEFAULT_AVATAR_IMAGE){
    	let image = await this.userService.uploadImage(this.user.image).toPromise();
    	this.user.image = image.url;
  	}

  	this.userService.save(this.user).subscribe(
  		res => {
  			this.isOpenedDialog = false;
  		}
  	)
  }

  protected updateDisplayName(): void {
  	this.user.displayName = this.user.firstName + ' ' + this.user.lastName;
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
}
