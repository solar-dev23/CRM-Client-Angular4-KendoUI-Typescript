import { Component, ChangeDetectorRef, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
	@Output() edit: EventEmitter<{object: any}> = new EventEmitter();

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

		this.edit.emit(this.user);
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

}
