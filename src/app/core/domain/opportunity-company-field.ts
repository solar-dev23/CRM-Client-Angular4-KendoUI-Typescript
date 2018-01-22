import * as _ from "lodash";
import { Field, FieldTemplate, FIELD_TYPE, Dropdown } from "crm-platform";
import { Observable } from "rxjs";

export class OpportunityCompanyField extends Field {
  public constructor(object: any, private companies: Dropdown[]) {
    super(object);
  }

  public getList(): Dropdown[] {
    return this.companies;
  }

  public valueToString(object: any): any {
    let that = this;
    let company_id = object.company_id || "";
    let company = this.companies.filter(function(company){ return company.id === company_id })[0];

    return company? company.name:"";
  }

  public static newOpportunityCompanyFieldInstance(fieldTemplate: FieldTemplate, companies: Dropdown[]): OpportunityCompanyField {
    return new OpportunityCompanyField(fieldTemplate, companies);
  }
}