import { Field, FIELD_TYPE } from "crm-platform";

export class ContactField extends Field {
  protected contacts: any[];

  public constructor(contacts) {
    super({});
    this.setName("contacts");
    this.setType(FIELD_TYPE.readonly);
    this.setTitle("Contacts");

    this.contacts = contacts;
  }

  public valueToString(object: any): any {
    if(object.contacts && object.contacts.length > 0) {
      let contact = this.contacts.find(contact => contact.id === object.contacts[0].id);
      let firstName = contact.firstName || "";
      let lastName = contact.lastName || "";
      return `${firstName} ${lastName}`;
    }
    else
      return '';
  }
}