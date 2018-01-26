import { Component } from "@angular/core";

@Component({
  selector: "users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"]
})
export class UsersComponent {
	public viewMode: string = 'card';

  public constructor() {
  };

  onChangeView(val) {
    this.viewMode = val;
  }
}