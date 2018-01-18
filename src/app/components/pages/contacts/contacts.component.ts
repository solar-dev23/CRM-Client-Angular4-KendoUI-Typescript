import { Component, OnInit } from "@angular/core";
import { ContactService, AccountService } from "../../../core";

@Component({
  selector: "contacts",
  templateUrl: "./contacts.component.html",
  styleUrls: ["./contacts.component.scss"]
})
export class ContactsComponent implements OnInit {
	protected accountList: any[];
	protected isLoaded: boolean = false;

  public constructor(protected contactService: ContactService, protected accountService: AccountService) {
  }

  public ngOnInit() {
  	this.accountService.read().subscribe(res => {
      this.accountList = res;
      this.isLoaded = true;
    })
  }
}