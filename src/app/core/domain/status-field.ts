import * as _ from "lodash";
import { Field, FieldTemplate, FIELD_TYPE } from "crm-platform";
import { Statuses } from "./statuses";
import { Observable } from "rxjs";

export class StatusField extends Field {
  public constructor(object: any, private statuses: Statuses[]) {
    super(object);
  }

  // public getStatus(opportunity: any) {
  //   let statusById = {};
  //   _.forEach(this.statuses, status => statusById[status.id] = status);
  //   let opportunityStatus = _.find(this.statuses, (status) => {
  //     return status.id === opportunity.id;
  //   });
  //   return opportunityStatus ? opportunityStatus : '';
  // }

  public getAllStatuses(): Statuses[] {
    return this.statuses;
  }

  public valueToString(object: any): any {
    let that = this;
    let status_id = object.status_id || "";
    let status = this.statuses.filter(function(status){ return status.id === status_id })[0];

    return status? status.name:"";
  }

  public static newStatusFieldInstance(fieldTemplate: FieldTemplate, statuses: Statuses[]): StatusField {
    return new StatusField(fieldTemplate, statuses);
  }
}