import { Field, FIELD_TYPE } from "crm-platform";

export class DisplayNameField extends Field {
  public constructor() {
    super({});
    this.setName("displayName");
    this.setType(FIELD_TYPE.readonly);
    this.setTitle("Display Name");
  }

  public valueToString(object: any): any {
    let firstName = object.firstName || "";
    let lastName = object.lastName || "";
    return `${firstName} ${lastName}`;
  }
}