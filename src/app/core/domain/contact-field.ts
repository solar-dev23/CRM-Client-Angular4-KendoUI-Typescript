import { Field, FIELD_TYPE } from "crm-platform";

export class ContactField extends Field {
  protected contacts: any[];

  public constructor() {
    super({});
    this.setName("contacts");
    this.setType(FIELD_TYPE.readonly);
    this.setTitle("Contacts");
  }

  public valueToString(object: any): any {
    if(object.contacts && object.contacts.length > 0)
      return object.contacts[0].id;
    else
      return '';
  }
}