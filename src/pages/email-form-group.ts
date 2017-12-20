import * as _ from "lodash";
import {AbstractControl, FormControl} from "@angular/forms";
import {Http} from "@angular/http";
import {BaseFormGroup, VALIDATOR_TYPE, ValidatorUtils} from "crm-platform"
import {REQUEST_URL} from "core";

export class EmailFormGroup extends BaseFormGroup {
  public static EMAIL_MESSAGES_MAP: any = {[VALIDATOR_TYPE.required]: "Email is required"};

  public constructor(private http: Http = null, email: string = "",
                     controls: {[key: string]: AbstractControl;} = {}, messagesMapByField: any = {}) {
    super(controls, messagesMapByField);
    let emailMessagesMap = _.clone(EmailFormGroup.EMAIL_MESSAGES_MAP);
    ValidatorUtils.addUniqueMessage(emailMessagesMap, "User with this email already exists");
    ValidatorUtils.addEmailFormatMessage(emailMessagesMap);
    let uniqueUserValidator;
    if(this.http) {
      uniqueUserValidator = ValidatorUtils.buildUniqueValidator(REQUEST_URL.unique_user, null, this.http);
    }
    this.addControl("email", new FormControl(email, [ValidatorUtils.buildRequiredValidator(),
      ValidatorUtils.buildEmailFormatValidator()], uniqueUserValidator));
    this.setMessagesMap("email", emailMessagesMap);
  }

  public getEmail(): string {
    return this.value.email;
  }
}