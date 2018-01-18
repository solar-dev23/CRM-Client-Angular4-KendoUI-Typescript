import { Field, FIELD_TYPE } from "crm-platform";

export class AccountField extends Field {
  protected accounts: any[];

  public constructor(accounts) {
    super({});
    this.setName("accounts");
    this.setType(FIELD_TYPE.readonly);
    this.setTitle("Accounts");

    this.accounts = accounts;
  }

  public valueToString(object: any): any {
    if(object.accounts && object.accounts.length > 0) {
      let account = this.accounts.find(account => account.id === object.accounts[0].id);
      return account.companyName;
    }
    else
      return '';
  }
}