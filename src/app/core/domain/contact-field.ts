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
    return object.contacts[0].id;
  }
}