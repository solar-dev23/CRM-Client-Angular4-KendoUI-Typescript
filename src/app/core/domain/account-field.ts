import { Field, FIELD_TYPE } from "crm-platform";

export class AccountField extends Field {
  protected accounts: any[];

  public constructor() {
    super({});
    this.setName("accounts");
    this.setType(FIELD_TYPE.readonly);
    this.setTitle("Accounts");
  }

  public valueToString(object: any): any {
    if(object.accounts && object.accounts.length > 0)
      return object.accounts[0].id;
    else
      return '';
  }
}