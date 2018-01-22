import * as _ from "lodash";
import { Field, FieldTemplate, FIELD_TYPE, Dropdown } from "crm-platform";
import { Observable } from "rxjs";

export class OpportunityContactField extends Field {
  public constructor(object: any, private contacts: Dropdown[]) {
    super(object);
  }

  public getList(): Dropdown[] {
    return this.contacts;
  }

  public valueToString(object: any): any {
    let that = this;
    let contact_id = object.contact_id || "";
    let contact = this.contacts.filter(function(contact){ return contact.id === contact_id })[0];

    return contact? contact.name:"";
  }

  public static newOpportunityContactFieldInstance(fieldTemplate: FieldTemplate, contacts: Dropdown[]): OpportunityContactField {
    return new OpportunityContactField(fieldTemplate, contacts);
  }
}