import { FIELD_TYPE, FieldTemplate, Grid, GridColumn, GridTemplate, VALIDATOR_TYPE, ERROR_MESSAGES } from "crm-platform";
import { ENTITY_NAME, REQUEST_URL } from "../constants";
import { RevenueField } from "../domain/revenue-field";
// import { Statuses } from "../domain/statuses";
import { StatusField } from "../domain/status-field";
import { StatusService } from "./status.service";
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
    name: "company",
    type: FIELD_TYPE.text,
    title: "Company",
    validators: [
      {
        type: VALIDATOR_TYPE.required,
        errorMessage: "Company is required"
      }
    ]
  };

  public static CONTACT_FIELD_TEMPLATE: FieldTemplate = {
    name: "contact",
    type: FIELD_TYPE.text,
    title: "Contact",
    validators: [
      {
        type: VALIDATOR_TYPE.required,
        errorMessage: "Contact is required"
      }
    ]
  };

  // public static REVENUE_FIELD_TEMPLATE: FieldTemplate = {
  //   name: "value",
  //   type: FIELD_TYPE.decimal,
  //   title: "Revenue"
  // };

  public static STATUS_FIELD_TEMPLATE: FieldTemplate = {
    name: "status_id",
    type: FIELD_TYPE.text,
    title: "Status"
  };
    
  public static RATING_FIELD_TEMPLATE: FieldTemplate = {
    name: "rating",
    type: FIELD_TYPE.text,
    title: "Rating"
  };

  public static CREATED_DATE_FIELD_TEMPLATE: FieldTemplate = {
    name: "createdAt",
    type: FIELD_TYPE.text,
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
      {field: OpportunityGridFactory.COMPANY_FIELD_TEMPLATE},
      {field: OpportunityGridFactory.CONTACT_FIELD_TEMPLATE},
      // {field: OpportunityGridFactory.REVENUE_FIELD_TEMPLATE},
      // {field: OpportunityGridFactory.STATUS_FIELD_TEMPLATE},
      {field: OpportunityGridFactory.RATING_FIELD_TEMPLATE},
      {field: OpportunityGridFactory.CREATED_DATE_FIELD_TEMPLATE},
      {field: OpportunityGridFactory.DESCRIPTION_FIELD_TEMPLATE}
    ]
  };

  private constructor(private statusService: StatusService) {
    // do nothing;
    this.statusService.getStatuses().subscribe (
      res => {
        OpportunityGridFactory.statuses = _.toArray(res);
      }
    )
  }

  public static newGridInstance(): Grid {
    let grid = Grid.newInstance(OpportunityGridFactory.OPPORTUNITY_GRID_TEMPLATE);
    grid.addColumn(GridColumn.newInstanceByField(new RevenueField()), 3);
    let statusField = StatusField.newStatusFieldInstance(OpportunityGridFactory.STATUS_FIELD_TEMPLATE, OpportunityGridFactory.statuses);
    grid.addColumn(GridColumn.newInstanceByField(statusField), grid.columns.length - 1);
    
    return grid;
  }
}