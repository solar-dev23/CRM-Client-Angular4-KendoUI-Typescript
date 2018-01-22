import * as _ from "lodash";
import { Field, FieldTemplate, FIELD_TYPE, Dropdown } from "crm-platform";
import { Observable } from "rxjs";

export class StatusField extends Field {
  public constructor(object: any, private statuses: Dropdown[]) {
    super(object);
  }

  public getList(): Dropdown[] {
    return this.statuses;
  }

  public valueToString(object: any): any {
    let that = this;
    let status_id = object.status_id || "";
    let status = this.statuses.filter(function(status){ return status.id === status_id })[0];

    return status? status.name:"";
  }

  public static newStatusFieldInstance(fieldTemplate: FieldTemplate, statuses: Dropdown[]): StatusField {
    return new StatusField(fieldTemplate, statuses);
  }
}