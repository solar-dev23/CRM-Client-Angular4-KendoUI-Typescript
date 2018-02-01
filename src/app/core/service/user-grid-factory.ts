import { FIELD_TYPE, FieldTemplate, Grid, GridColumn, GridTemplate, VALIDATOR_TYPE, ERROR_MESSAGES } from "crm-platform";
import { ENTITY_NAME, REQUEST_URL } from "../constants";
import { DisplayNameField } from "../domain/display-name-field";
import { UserRole } from "../domain/user-role";
import { UserRoleField } from "../domain/user-role-field";

export class UserGridFactory {
  private static USERNAME_MIN_LENGTH: number = 4;
  private static PASSWORD_MIN_LENGTH: number = 8;

  public static USER_NAME_FIELD_TEMPLATE: FieldTemplate = {
    name: "username",
    type: FIELD_TYPE.text,
    title: "User Name",
    validators: [
      {
        type: VALIDATOR_TYPE.min_length,
        errorMessage: `User name should contain minimum ${UserGridFactory.USERNAME_MIN_LENGTH} chars`,
        value: UserGridFactory.USERNAME_MIN_LENGTH
      },
      {
        type: VALIDATOR_TYPE.unique,
        errorMessage: "User name should be unique",
        value: REQUEST_URL.unique_user
      }
    ]
  };

  public static EMAIL_FIELD_TEMPLATE: FieldTemplate = {
    name: "email",
    type: FIELD_TYPE.email,
    title: "Email",
    validators: [
      {
        type: VALIDATOR_TYPE.required,
        errorMessage: "Email is required"
      },
      {
        type: VALIDATOR_TYPE.email_format,
        errorMessage: ERROR_MESSAGES.incorrect_email
      }
    ]
  };

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

  public static  ACTIVE_FIELD_TEMPLATE: FieldTemplate = {
    name: "active",
    type: FIELD_TYPE.boolean,
    title: "Active"
  };

  public static ROLE_FIELD_TEMPLATE: FieldTemplate = {
    name: "roles",
    type: FIELD_TYPE.roles,
    title: "User Role",
  };

  public static PASSWORD_FIELD_TEMPLATE: FieldTemplate = {
    name: "password",
    type: FIELD_TYPE.password,
    title: "Password",
  };

  public static DEPARTMENT_FIELD_TEMPLATE: FieldTemplate = {
    name: "department_id",
    type: FIELD_TYPE.text,
    title: "Department"
  };

  public static USER_GRID_TEMPLATE: GridTemplate = {
    id: ENTITY_NAME.user,
    columns: [
      {field: UserGridFactory.USER_NAME_FIELD_TEMPLATE},
      {field: UserGridFactory.EMAIL_FIELD_TEMPLATE},
      {field: UserGridFactory.FIRST_NAME_FIELD_TEMPLATE},
      {field: UserGridFactory.LAST_NAME_FIELD_TEMPLATE},
      {field: UserGridFactory.ACTIVE_FIELD_TEMPLATE},
      {field: UserGridFactory.PASSWORD_FIELD_TEMPLATE},
      {field: UserGridFactory.DEPARTMENT_FIELD_TEMPLATE}
    ]
  };

  private constructor() {
    // do nothing;
  }

  public static newGridInstance(roles: UserRole[]): Grid {
    let grid = Grid.newInstance(UserGridFactory.USER_GRID_TEMPLATE);
    grid.addColumn(GridColumn.newInstanceByField(new DisplayNameField()), 0);
    let roleField = UserRoleField.newUserRoleFieldInstance(UserGridFactory.ROLE_FIELD_TEMPLATE, roles);
    grid.addColumn(GridColumn.newInstanceByField(roleField), grid.columns.length - 1);
    return grid;
  }
}