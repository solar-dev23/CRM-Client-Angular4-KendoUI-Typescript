import { Component, EventEmitter, Output } from "@angular/core";
import { AccountService } from "../../../core";

@Component({
  selector: "account-dialog",
  templateUrl: "./account-dialog.component.html",
  styleUrls: ["./account-dialog.component.scss"]
})
export class AccountDialogComponent {
	@Output() save: EventEmitter<{object: any}> = new EventEmitter();
	@Output() cancel: EventEmitter<any> = new EventEmitter();

	public constructor(
		protected accountService: AccountService
	) {
  }

  protected onFormSubmit(accountForm: any) {
    this.accountService.save(accountForm).subscribe(
      res => {
        this.save.emit(res);
      }
    )
  }

  protected onClose() {
  	this.cancel.emit();
  }
}