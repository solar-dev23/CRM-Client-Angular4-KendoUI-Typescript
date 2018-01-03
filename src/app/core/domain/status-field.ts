import * as _ from "lodash";
import { Field, FieldTemplate, FIELD_TYPE } from "crm-platform";
// import { Statuses } from "./statuses";
import { Observable } from "rxjs";

export class StatusField extends Field {
  public constructor(object: any, private statuses: any) {
    super(object);
console.log("!!!", object, statuses);
  }

  public getStatus(opportunity: any) {
    let statusById = {};
    _.forEach(this.statuses, status => statusById[status.id] = status);
    let opportunityStatus = _.find(this.statuses, (status) => {
      return status.id === opportunity.id;
    });
    return opportunityStatus ? opportunityStatus : '';
  }

  // public getAllStatus(): Statuses[] {
  //   return this.statuses;
  // }

  public static newStatusFieldInstance(fieldTemplate: FieldTemplate, statuses: any): StatusField {
    return new StatusField(fieldTemplate, []);
  }
}