import { FIELD_TYPE, FieldTemplate, Grid, GridColumn, GridTemplate, VALIDATOR_TYPE, ERROR_MESSAGES } from "crm-platform";
import { ENTITY_NAME, REQUEST_URL } from "../constants";
import { ContactField } from "../domain/contact-field";

import * as _ from "lodash";

export class AccountGridFactory {

  public static DISPLAY_NAME_FIELD_TEMPLATE: FieldTemplate = {
    name: "displayName",
    type: FIELD_TYPE.text,
    title: "Display Name"
  };

  public static COMPANY_NAME_FIELD_TEMPLATE: FieldTemplate = {
    name: "companyName",
    type: FIELD_TYPE.text,
    title: "Company Name",
    validators: [
      {
        type: VALIDATOR_TYPE.required,
        errorMessage: "Company name is required"
      }
    ]
  };

  public static PREFERED_PAYMENT_METHOD_FIELD_TEMPLATE: FieldTemplate = {
    name: "prefered_payment_method",
    type: FIELD_TYPE.text,
    title: "Prefered Payment Method"
  };
    
  public static PREFERED_DELIVERY_METHOD_FIELD_TEMPLATE: FieldTemplate = {
    name: "prefered_delivery_method",
    type: FIELD_TYPE.text,
    title: "Prefered Delivery Method"
  };

  public static TERMS_FIELD_TEMPLATE: FieldTemplate = {
    name: "terms",
    type: FIELD_TYPE.text,
    title: "Terms"
  };

  public static NUMBER_OF_EMPLOYEES_FIELD_TEMPLATE: FieldTemplate = {
    name: "number_of_employees",
    type: FIELD_TYPE.integer,
    title: "Number of Employees"
  };

  public static ANNUAL_REVENUE_FIELD_TEMPLATE: FieldTemplate = {
    name: "annual_revenue",
    type: FIELD_TYPE.integer,
    title: "Annual Revenue"
  };

  public static LEAD_SOURCE_FIELD_TEMPLATE: FieldTemplate = {
    name: "lead_source",
    type: FIELD_TYPE.text,
    title: "Lead Source"
  };

  public static LEAD_RATING_FIELD_TEMPLATE: FieldTemplate = {
    name: "lead_rating",
    type: FIELD_TYPE.rating,
    title: "Lead Rating"
  };

  public static NOTES_FIELD_TEMPLATE: FieldTemplate = {
    name: "notes",
    type: FIELD_TYPE.text,
    title: "Notes"
  };

  public static ACCOUNT_GRID_TEMPLATE: GridTemplate = {
    id: ENTITY_NAME.account,
    columns: [
      {field: AccountGridFactory.DISPLAY_NAME_FIELD_TEMPLATE},
      {field: AccountGridFactory.COMPANY_NAME_FIELD_TEMPLATE},
      {field: AccountGridFactory.PREFERED_PAYMENT_METHOD_FIELD_TEMPLATE},
      {field: AccountGridFactory.PREFERED_DELIVERY_METHOD_FIELD_TEMPLATE},
      {field: AccountGridFactory.TERMS_FIELD_TEMPLATE},
      {field: AccountGridFactory.NUMBER_OF_EMPLOYEES_FIELD_TEMPLATE},
      {field: AccountGridFactory.ANNUAL_REVENUE_FIELD_TEMPLATE},
      {field: AccountGridFactory.LEAD_SOURCE_FIELD_TEMPLATE},
      {field: AccountGridFactory.LEAD_RATING_FIELD_TEMPLATE},
      {field: AccountGridFactory.NOTES_FIELD_TEMPLATE}
    ]
  };

  private constructor() {
    // do nothing;
  }

  public static newGridInstance(contacts): Grid {
    let grid = Grid.newInstance(AccountGridFactory.ACCOUNT_GRID_TEMPLATE);
    grid.addColumn(GridColumn.newInstanceByField(new ContactField(contacts)), 4);

    return grid;
  }
}