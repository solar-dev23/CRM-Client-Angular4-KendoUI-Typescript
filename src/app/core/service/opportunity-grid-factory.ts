import { FIELD_TYPE, FieldTemplate, Grid, GridColumn, GridTemplate, VALIDATOR_TYPE, ERROR_MESSAGES, Dropdown } from "crm-platform";
import { ENTITY_NAME, REQUEST_URL } from "../constants";
import { RevenueField } from "../domain/revenue-field";
import { StatusField } from "../domain/status-field";
import { OpportunityCompanyField } from "../domain/opportunity-company-field";
import { OpportunityContactField } from "../domain/opportunity-contact-field";

import * as _ from "lodash";

export class OpportunityGridFactory {
  public static statuses = [];

  public static NAME_FIELD_TEMPLATE: FieldTemplate = {
    name: "name",
    type: FIELD_TYPE.text,
    title: "Name",
    validators: [
      {
        type: VALIDATOR_TYPE.required,
        errorMessage: "Name is required"
      }
    ]
  };

  public static COMPANY_FIELD_TEMPLATE: FieldTemplate = {
    name: "company_id",
    type: FIELD_TYPE.dropdown,
    title: "Company",
    validators: [
      {
        type: VALIDATOR_TYPE.required,
        errorMessage: "Company is required"
      }
    ]
  };

  public static CONTACT_FIELD_TEMPLATE: FieldTemplate = {
    name: "contact_id",
    type: FIELD_TYPE.dropdown,
    title: "Contact",
    validators: [
      {
        type: VALIDATOR_TYPE.required,
        errorMessage: "Contact is required"
      }
    ]
  };

  public static STATUS_FIELD_TEMPLATE: FieldTemplate = {
    name: "status_id",
    type: FIELD_TYPE.dropdown,
    title: "Status"
  };
    
  public static RATING_FIELD_TEMPLATE: FieldTemplate = {
    name: "rating",
    type: FIELD_TYPE.rating,
    title: "Rating"
  };

  public static CREATED_DATE_FIELD_TEMPLATE: FieldTemplate = {
    name: "createdAt",
    type: FIELD_TYPE.date,
    title: "Date Created"
  };

  public static DESCRIPTION_FIELD_TEMPLATE: FieldTemplate = {
    name: "description",
    type: FIELD_TYPE.text,
    title: "Description"
  };

  public static OPPORTUNITY_GRID_TEMPLATE: GridTemplate = {
    id: ENTITY_NAME.opportunity,
    columns: [
      {field: OpportunityGridFactory.NAME_FIELD_TEMPLATE},
      {field: OpportunityGridFactory.RATING_FIELD_TEMPLATE},
      {field: OpportunityGridFactory.CREATED_DATE_FIELD_TEMPLATE},
      {field: OpportunityGridFactory.DESCRIPTION_FIELD_TEMPLATE}
    ]
  };

  private constructor() {
    // do nothing;
  }

  public static newGridInstance(contacts: Dropdown[], companies: Dropdown[], statuses: Dropdown[]): Grid {    
    let grid = Grid.newInstance(OpportunityGridFactory.OPPORTUNITY_GRID_TEMPLATE);
    grid.addColumn(GridColumn.newInstanceByField(new RevenueField()), 3);
    let companyField = OpportunityCompanyField.newOpportunityCompanyFieldInstance(OpportunityGridFactory.COMPANY_FIELD_TEMPLATE, companies);
    grid.addColumn(GridColumn.newInstanceByField(companyField), 1);
    let contactField = OpportunityContactField.newOpportunityContactFieldInstance(OpportunityGridFactory.CONTACT_FIELD_TEMPLATE, contacts);
    grid.addColumn(GridColumn.newInstanceByField(contactField), 2);
    let statusField = StatusField.newStatusFieldInstance(OpportunityGridFactory.STATUS_FIELD_TEMPLATE, statuses);
    grid.addColumn(GridColumn.newInstanceByField(statusField), grid.columns.length - 1);
    
    return grid;
  }
}