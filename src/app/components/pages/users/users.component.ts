import { Component } from "@angular/core";

@Component({
  selector: "users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"]
})
export class UsersComponent {
	public viewOpt: string = 'grid';

  public constructor() {
  };

  onChangeView(val) {
    this.viewOpt = val;
  }
}