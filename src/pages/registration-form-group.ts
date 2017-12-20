import {FormControl} from "@angular/forms";
import {Http} from "@angular/http";
import {VALIDATOR_TYPE, ValidatorUtils} from "crm-platform";
import {EmailFormGroup} from "./email-form-group";

export class RegistrationFormGroup extends EmailFormGroup {
  private static errorMessagesByField: any = {
    firstName: {[VALIDATOR_TYPE.required]: "First name is required"},
    lastName: {[VALIDATOR_TYPE.required]: "Last name is required"},
    company: {[VALIDATOR_TYPE.required]: "Company name is required"},
  };

  public constructor(http: Http, registrationData: any = {}) {
    super(http, registrationData.email, {
      "firstName": new FormControl(registrationData.firstName || "", ValidatorUtils.buildRequiredValidator()),
      "lastName": new FormControl(registrationData.lastName || "", ValidatorUtils.buildRequiredValidator()),
      "company": new FormControl(registrationData.company || "", ValidatorUtils.buildRequiredValidator()),
      "jobTitle": new FormControl(registrationData.jobTitle || ""),
      "employeeNumber": new FormControl(registrationData.employeeNumber || ""),
      "location": new FormControl(registrationData.location || ""),
      "businessType": new FormControl(registrationData.businessType || ""),
    }, RegistrationFormGroup.errorMessagesByField);

    this.addControl("phone", new FormControl(registrationData.phone || "",
      ValidatorUtils.buildPhoneNumberFormatValidator()));
    this.setMessagesMap("phone", ValidatorUtils.addPhoneNumberFormatMessage({}))
  }

  public getRegistrationData(): any {
    return this.value;
  }
}
