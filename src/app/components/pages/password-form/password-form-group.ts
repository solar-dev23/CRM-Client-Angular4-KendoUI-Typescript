import * as _ from "lodash";
import { AbstractControl, FormControl } from "@angular/forms";
import { BaseFormGroup, ValidatorUtils, VALIDATOR_TYPE, Field } from "crm-platform";

export class PasswordFormGroup extends BaseFormGroup {
  private static PASSWORD_MESSAGES_MAP: any = {
    [VALIDATOR_TYPE.min_length]: "Password should be at least 8 characters",
    [VALIDATOR_TYPE.required]: "Password is required",
  };
  private static CONFIRM_PASSWORD_MESSAGES_MAP: any = {
    [VALIDATOR_TYPE.required]: "Password confirmation is required"
  };

  private static LETTERS_AND_NUMBERS_ERROR_MESSAGE: string = "Password should contain letters and numbers";
  private static DIFFERENT_REGISTER_ERROR_MESSAGE: string = "Password should contain uppercase and lowercase letters";

  public constructor(private editPassword: boolean = false, private confirmPassword: boolean = false,
                     controls: {[key: string]: AbstractControl;} = {}, messagesMapByField: any = {}) {
    super(controls, messagesMapByField);

    let passwordMessagesMap = _.clone(PasswordFormGroup.PASSWORD_MESSAGES_MAP);
    ValidatorUtils.addLettersAndNumbersMessage(passwordMessagesMap, PasswordFormGroup.LETTERS_AND_NUMBERS_ERROR_MESSAGE);
    ValidatorUtils.addDifferentRegisterMessage(passwordMessagesMap, PasswordFormGroup.DIFFERENT_REGISTER_ERROR_MESSAGE);
    _.assign(passwordMessagesMap, PasswordFormGroup.PASSWORD_MESSAGES_MAP);

    let passwordValidators = null;
    if (editPassword) {
      passwordValidators = [
        ValidatorUtils.buildRequiredValidator(),
        ValidatorUtils.buildMinLengthValidator(8),
        ValidatorUtils.buildLettersAndNumbersValidator(),
        ValidatorUtils.buildDifferentRegisterValidator()
      ]
    }
    this.addControl("password", new FormControl(!editPassword ? Field.PASSWORD_LABEL : "", passwordValidators));
    if (confirmPassword) {
      this.addControl("confirmPassword", new FormControl("", [ValidatorUtils.buildRequiredValidator()]));
      this.setValidators([ValidatorUtils.buildMatchPasswordValidator("password", "confirmPassword")]);
      this.setMessagesMap("confirmPassword", PasswordFormGroup.CONFIRM_PASSWORD_MESSAGES_MAP);
    }

    this.setMessagesMap("password", passwordMessagesMap);
  }

  public isPasswordEditable(): boolean {
    return this.editPassword;
  }

  public getPasswordMatchesErrorMessage(): string {
    return ValidatorUtils.getMatchPasswordError(this);
  }

  public getPassword(): string {
    return this.value.password;
  }
}
