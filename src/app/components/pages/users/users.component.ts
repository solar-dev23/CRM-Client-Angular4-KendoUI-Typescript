import { Component } from "@angular/core";
import { DEFAULT_AVATAR_IMAGE } from '../../../core';
import { UserService } from "../../../core";

@Component({
  selector: "users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"]
})
export class UsersComponent {
	protected user: any;
	protected viewMode: string = 'card';
	protected isShowDialog: boolean;
  protected customData: any;
  protected isLoadedData: boolean;

  constructor(protected userService: UserService) {
  };

  public async ngOnInit() {
    this.customData = await this.userService.read().toPromise();
    this.isLoadedData = true;
  }

  protected onChangeView(val) {
    this.viewMode = val;
  }

  protected onEdit(user) {
  	this.user = user;
  	this.isShowDialog = true;
  }

  protected onCreate(user) {
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
  	this.isShowDialog = true;
  }

  protected onCloseDialog() {
  	this.isShowDialog = false;
  }

  protected async onAddUser(user) {
    this.customData = await this.userService.read().toPromise();
    this.isShowDialog = false;
  }
}