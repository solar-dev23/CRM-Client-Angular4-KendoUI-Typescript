import {Role} from "crm-platform";

export interface UserRole extends Role{
  readonly permissions: string[];
}

