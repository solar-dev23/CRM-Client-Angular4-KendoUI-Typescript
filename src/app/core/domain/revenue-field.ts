import { Field, FIELD_TYPE } from "crm-platform";

export class RevenueField extends Field {
  public constructor() {
    super({});
    this.setName("revenue");
    this.setType(FIELD_TYPE.decimal);
    this.setTitle("Revenue");
  }

  public valueToString(object: any): any {
    let currency = object.currency || "";
    let value = parseFloat(object.value).toFixed(2) || "";

    if(value !== "NaN" && value !== ""){
      if(currency === "USD")
        return `$${value}`;
      else
        return `€${value}`;
    }

  }
}