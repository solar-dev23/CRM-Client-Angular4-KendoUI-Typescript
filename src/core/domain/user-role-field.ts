import * as _ from "lodash";
import {RoleField, FieldTemplate} from "crm-platform";
import {UserRole} from "./user-role";
import {PERMISSIONS} from "../constants";

export class UserRoleField extends RoleField {

  public constructor(object: any, private roles: UserRole[]) {
    super(object);
  }

  public getAvailableRoles(user: any): UserRole[] {
    let roleById = {};
    _.forEach(this.roles, role => roleById[role.id] = role);
    let administratorRole = _.find(user.roles, (role) => {
      role = roleById[role.id];
      return role && _.indexOf(role.permissions, PERMISSIONS.administration) >= 0;
    });
    return administratorRole ? [roleById[administratorRole.id]] : this.roles;
  }

  public getAllRoles(): UserRole[] {
    return this.roles;
  }

  public static newUserRoleFieldInstance(fieldTemplate: FieldTemplate, roles: UserRole[]): UserRoleField {
    return new UserRoleField(fieldTemplate, roles);
  }
}