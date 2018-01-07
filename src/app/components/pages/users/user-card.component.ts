import { Component, ViewEncapsulation, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ValidationService  } from '../../shared/validation.service';
import { ControlMessages } from '../../shared/control-messages';
// import { UserService, OperationService }   from '../UsersService';
import { Observable } from 'rxjs/Rx';
// import { CommService } from "../service/CommService";
import { NgxPaginationModule } from 'ngx-pagination';
import { ImageUploadService, UserService } from '../../../core';
import { ImageCropperDialogComponent } from '../image-cropper/image-cropper.component';


@Component({
  selector: 'user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
  /*host: {
    '(document:click)': 'onClick($event)'
  }*/
})
export class UserCardComponent implements OnInit {
	opened=false;
	userEditForm:any;
	users:Array<any>;
	page = {take:20,skip:1,totals:0,IsActive:null};
	gearMenu=true;
	menuColors:Array<any>[];
	cardColors:any;
	confirmDelete = false;
	deleteItem:any;
	pagingHide=true;
	//image component
  image:string;
  base64Image: string;
  cropperVisible:boolean;
  imageUploadUrl:string;

	// constructor(private formBuilder: FormBuilder,private service: UserService, private opService : OperationService,private cd: ChangeDetectorRef, private comm: CommService,private imageUploadService: ImageUploadService) {
	constructor(private formBuilder: FormBuilder, private cd: ChangeDetectorRef, private imageUploadService: ImageUploadService, private userService: UserService) {
		this.userEditForm = this.formBuilder.group({
	      'firstName': ['', Validators.required],
	      'lastName': ['', Validators.required],
	      'username': ['', Validators.required],
	      'password': ['', [Validators.required,ValidationService.passwordValidator]],
	      'email': ['', [Validators.required, ValidationService.emailValidator]],
	      // 'Zip':['',[ValidationService.numberValidator]],
	      // 'DOB':new FormControl(null),
	      // 'TerminateDate':new FormControl(null),
	      // 'HireDate':new FormControl(null),
	      'displayName':new FormControl(null),
	      // 'Street':new FormControl(null),
	      // 'Street2':new FormControl(null),
	      // 'City':new FormControl(null),
	      // 'State':new FormControl(null),
	      // 'Country':new FormControl(null),
	      // 'Role':new FormControl(null),
	      // 'IsActive':new FormControl(false),
	      // 'PhoneNo':new FormControl(null),
	      'id':new FormControl(0),
	      'image':new FormControl(null)
    	});
    	this.menuColors = new Array<any>({color:"#fbf8f8"},{color:"yellow"},{color:"#ffcc00"},{color:"#00ffff"},{color:"#66ffcc"},{color:"#e2dede"});
    	this.cardColors = [];
	}
	//ng init
	ngOnInit() {
		this.LoadDataList();
		var that = this;
		// this.comm.receiveUpdatedData().subscribe(function(d:any){
		// 	if(d.ddlvalue=="Active")
		// 		that.page.IsActive=true;
		// 	else if(d.ddlvalue=="Inactive")
		// 		that.page.IsActive=false;
		// 	else
		// 		that.page.IsActive=null;
		// 	that.page.skip=1;
		// 	that.LoadDataList();
		// });
	}

	public saveUser():void{
		//this.userForm.dirty &&
		if (this.userEditForm.valid) {
			var me=this;
      //If id >0 then consider as update existing value.
      if(this.userEditForm.value.id){
      	if(this.image!=null){
          this.imageUploadService.uploadImage(this.image).subscribe(res => {
			      me.clearImage();
			      console.log("response=>",res);
			      me.imageUploadUrl = res.image;
			      me.saveToServer(me);
			   	});
     	  }
	   else
	   		this.saveToServer(this);
      }
		}
		else{
			this.validateAllFormFields(this.userEditForm);
		}
	}

	//save to server
	public saveToServer(that:UserCardComponent):void{
		if(that.imageUploadUrl!=null)
	        that.userEditForm.patchValue({"Image":that.imageUploadUrl});
	  
     //    that.opService.update(that.userEditForm.value,function(){
	    //     that.opened = false;
	    //     that.users.forEach(function(f){
	    //     	if(f.Id == that.userEditForm.value.Id){
	    //     		Object.assign(f,that.userEditForm.value);
	    //     	}
	    //     });
	    //     that.LoadDataList();
	    //     that.clearForm();
	    // });
	}

	//External editor close
	close(status) {
	  this.opened = false;
	  this.clearForm();
	}
	//External editor open
	open() {
	  this.opened = true;
	}
	//Clear forms
	clearForm(){
    	this.userEditForm.patchValue({
	      id:0,
	  		// City:"",
	  		// Country:"",
	  		// DOB:null,
	  		displayName:"",
	  		email:"",
	  		firstName:"",
	  		// HireDate:null,
	  		// IsActive:false,
	  		lastName:"",
	  		password:"",
	  		// Phone:"",
	  		// Role:"",
	  		// State:"",
	  		// Street:"",
	  		// Street1:"",
	  		// TerminateDate:null,
	  		username:"",
	  		// ZipCode:""
    	});
    	this.imageUploadUrl=null;
    	this.image=null;
	}
	//set values
	private SetValues(item:any):void {
      var popupData = {createdAt:null,updatedAt:null};
      for (var k in item) {
        if(k=="TerminateDate" || k=="DOB" || k=="HireDate")
          {
            if(item[k]!=null)
              popupData[k]= new Date(item[k]);  
          }
        else
          popupData[k]=item[k];
      }
      delete popupData.createdAt;
      delete popupData.updatedAt;
      this.userEditForm.patchValue(popupData); 
      this.validateAllFormFields(this.userEditForm);
    }
    //display name merging
	public changeDisplayName (){
		this.userEditForm.patchValue({"DisplayName":this.userEditForm.value.firstName + ' '+this.userEditForm.value.lastName});
	}
  	//Validate all form input
	public validateAllFormFields(formGroup: FormGroup) {             
	  	Object.keys(formGroup.controls).forEach(field => {  	  
		    const control = formGroup.get(field);             
		    if (control instanceof FormControl) {             
		      control.markAsTouched({ onlySelf: true });
		    } else if (control instanceof FormGroup) {        
		      this.validateAllFormFields(control);            
		    }
  		});
	}
	//Load data
	private LoadDataList():void{
		var me = this;
		var _page = Object.assign({}, this.page);
		_page.skip = this.page.skip - 1;
		console.log("page=>",_page);
		this.userService.read().subscribe(
			res => {
				me.users = res;
				me.page.totals = res.length;
				me.pagingHide = false;
			}
		)
		// this.opService.queryCards(_page).subscribe(res=> {
		// 	me.users = res.data;
		// 	me.page.totals = res.count;
		// 	me.pagingHide = false;
		// });
	}

	//Show menu
	public showMenu(e):void{
		if(e.target.tagName=="SPAN")
			e.target.parentElement.getElementsByClassName("card-menu")[0].style.display="block";
		else
			e.target.parentElement.parentElement.getElementsByClassName("card-menu")[0].style.display="block";
	}
	//Menu mouse over leave event
	public menuLeave(e):void{
		e.fromElement.style.display="none";
	}
	//Parent component search click
	public onSearch(e):void{
		console.log("Parent event=>",e);
	}
	//Edit user	
	public editUser(user):void{
		this.SetValues(user);
		this.imageUploadUrl = user.Image;
		this.opened = true;
	}

	//Delete user
	public deleteUser(user):void{
		this.deleteItem = user;
		this.confirmDelete = true;
	}
	//delete records
	public delClose(cnf):void{
		if(cnf=="yes"){
			var that = this;
			// this.opService.delete(this.deleteItem,function(){
			// 	that.LoadDataList();
			// 	that.deleteItem = null;
			// });
			this.confirmDelete = false;
		}
		else
			this.confirmDelete = false;
	}
	//Call when color select from menu
	public changeColor(user,colorOpt):void{
		if(this.cardColors.filter(f=> f.Id==user.Id).length==0)
			this.cardColors.push({Id:user.Id,color:colorOpt.color});
		else
			this.cardColors.forEach(f=>{
				if(f.Id==user.Id)
					f.color=colorOpt.color;
			});
	}
	//Set color on card
	public setColorOnCard(user):any{
		var find = this.cardColors.filter(f=> f.Id==user.Id);
		if(find.length==0)
			return {"background-color":"white"};
		else
			return {"background-color": find[0].color};
	}
	//Page selection changes
	public pageChange(e):any{
		this.page.skip = e;
		this.LoadDataList();
		console.log("Pagingi=> ",e);
	}

	public jumpFirst(e):void{
		e.pageChange.emit(1);
	}

	public jumpLast(e):void{
		//this.page.skip= Math.ceil(this.page.totals/this.page.take);
		e.pageChange.emit(Math.ceil(this.page.totals/this.page.take))
	}

	//Image upload
  public onCropped(croppedInBase64):void{
    this.cropperVisible = false;
    if (croppedInBase64) {
      this.image = croppedInBase64;
    }
  }

  public onProfileImgClick(e):void{
    //this.cropperVisible = true;
    document.getElementById("card-upload-input").click();
  }

  fileChangeListener($event) {
    this.base64Image = undefined;
    var image: any = new Image();
    var file: File = $event.target.files[0];
    var myReader: FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function (loadEvent: any) {
      image.src = loadEvent.target.result;
      that.base64Image = image.src;
      that.cropperVisible = true;
    };
    myReader.readAsDataURL(file);
  }

  public uploadImage():void{
    var me= this;
    this.imageUploadService.uploadImage(this.image).subscribe(res => {
      this.clearImage();
      //console.log("response=>",res);
      me.imageUploadUrl = res.image;
    });
  }

  public clearImage():void{
    this.image = null;
  }

}
