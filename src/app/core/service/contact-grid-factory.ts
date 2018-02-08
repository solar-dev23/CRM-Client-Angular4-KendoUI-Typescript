import { FIELD_TYPE, FieldTemplate, Grid, GridColumn, GridTemplate, VALIDATOR_TYPE, ERROR_MESSAGES } from "crm-platform";
import { ENTITY_NAME, REQUEST_URL } from "../constants";
import { DisplayNameField } from "../domain/display-name-field";
import { AccountField } from "../domain/account-field";

import * as _ from "lodash";

export class ContactGridFactory {

  public static FIRST_NAME_FIELD_TEMPLATE: FieldTemplate = {
    name: "firstName",
    type: FIELD_TYPE.text,
    title: "First Name",
    validators: [
      {
        type: VALIDATOR_TYPE.required,
        errorMessage: "First name is required"
      }
    ]
  };

  public static LAST_NAME_FIELD_TEMPLATE: FieldTemplate = {
    name: "lastName",
    type: FIELD_TYPE.text,
    title: "Last Name",
    validators: [
      {
        type: VALIDATOR_TYPE.required,
        errorMessage: "Last name is required"
      }
    ]
  };

  public static JOB_TITLE_FIELD_TEMPLATE: FieldTemplate = {
    name: "jobTitle",
    type: FIELD_TYPE.text,
    title: "Job Title"
  };

  public static EMAIL_FIELD_TEMPLATE: FieldTemplate = {
    name: "email",
    type: FIELD_TYPE.email,
    title: "Email",
    validators: [
      {
        type: VALIDATOR_TYPE.email_format,
        errorMessage: ERROR_MESSAGES.incorrect_email
      }
    ]
  };

  public static PHONE_FIELD_TEMPLATE: FieldTemplate = {
    name: "phone",
    type: FIELD_TYPE.phone,
    title: "Phone",
    validators: [
      {
        type: VALIDATOR_TYPE.phone_number_format,
        errorMessage: ERROR_MESSAGES.phone_number_format
      }
    ]
  };

  public static EXTENSION_FIELD_TEMPLATE: FieldTemplate = {
    name: "extension",
    type: FIELD_TYPE.text,
    title: "Extension"
  };
    
  public static FAX_FIELD_TEMPLATE: FieldTemplate = {
    name: "fax",
    type: FIELD_TYPE.text,
    title: "Fax",
    validators: [
      {
        type: VALIDATOR_TYPE.phone_number_format,
        errorMessage: ERROR_MESSAGES.phone_number_format
      }
    ]
  };

  public static MOBILE_FIELD_TEMPLATE: FieldTemplate = {
    name: "mobile",
    type: FIELD_TYPE.text,
    title: "Mobile",
    validators: [
      {
        type: VALIDATOR_TYPE.phone_number_format,
        errorMessage: ERROR_MESSAGES.phone_number_format
      }
    ]
  };

  public static CONTACT_GRID_TEMPLATE: GridTemplate = {
    id: ENTITY_NAME.contact,
    columns: [
      {field: ContactGridFactory.FIRST_NAME_FIELD_TEMPLATE},
      {field: ContactGridFactory.LAST_NAME_FIELD_TEMPLATE},
      {field: ContactGridFactory.JOB_TITLE_FIELD_TEMPLATE},
      {field: ContactGridFactory.EMAIL_FIELD_TEMPLATE},
      {field: ContactGridFactory.PHONE_FIELD_TEMPLATE},
      {field: ContactGridFactory.EXTENSION_FIELD_TEMPLATE},
      {field: ContactGridFactory.FAX_FIELD_TEMPLATE},
      {field: ContactGridFactory.MOBILE_FIELD_TEMPLATE}
    ]
  };

  private constructor() {
    // do nothing;
  }

  public static newGridInstance(accounts): Grid {
    let grid = Grid.newInstance(ContactGridFactory.CONTACT_GRID_TEMPLATE);
    grid.addColumn(GridColumn.newInstanceByField(new DisplayNameField()), 0);
    grid.addColumn(GridColumn.newInstanceByField(new AccountField(accounts)), grid.columns.length - 2);
    return grid;
  }
}