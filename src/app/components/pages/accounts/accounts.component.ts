import { Component, OnInit } from "@angular/core";
import { ContactService } from "../../../core";

@Component({
  selector: "accounts",
  templateUrl: "./accounts.component.html",
  styleUrls: ["./accounts.component.scss"]
})
export class AccountsComponent implements OnInit {
	protected contactList: any[];
	protected isLoaded: boolean = false;

  public constructor(protected contactService: ContactService) {
  };

  public ngOnInit() {
  	this.contactService.read().subscribe(res => {
      this.contactList = res;
      this.isLoaded = true;
    })
  }
}