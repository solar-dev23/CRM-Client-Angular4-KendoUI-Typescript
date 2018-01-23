import { Component, EventEmitter, Output } from "@angular/core";
import { ContactService } from "../../../core";

@Component({
  selector: "contact-dialog",
  templateUrl: "./contact-dialog.component.html",
  styleUrls: ["./contact-dialog.component.scss"]
})
export class ContactDialogComponent {
	@Output() save: EventEmitter<{object: any}> = new EventEmitter();
	@Output() cancel: EventEmitter<any> = new EventEmitter();

	public constructor(
		protected contactService: ContactService
	) {
  }

  protected onFormSubmit(contactForm: any) {
    this.contactService.save(contactForm).subscribe(
      res => {
        this.save.emit(res);
      }
    )
  }

  protected onClose() {
  	this.cancel.emit();
  }
}