import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { DataSourceAdapter, Grid } from "crm-platform";
import { HttpUtils } from "../http-utils";
import { LoginService } from "./login.service";
import { UserGridFactory } from "./user-grid-factory";

@Injectable()
export class UserService extends DataSourceAdapter<any> {
  public constructor(private http: Http, private loginService: LoginService) {
    super();
  };

  public read(): Observable<any[]> {
    return this.http.post("/rest/administration/user/all", null).map((res) => res.json());
  }

  public save(user: any): Observable<any> {
    let requestOptions = HttpUtils.buildRequestOptionsForTransferObject(user);
    return this.http.post("/rest/administration/user/save", null, requestOptions).map((res) => {
      let object = res.json();
      object.id !== this.loginService.getUserId() && this.isAdministrator(object) && this.loginService.logout();
      return object;
    });
  }

  private isAdministrator(user: any): boolean {
    let administratorRole = this.loginService.getAdministratorRole();
    return administratorRole && _.find(user.roles, {id: administratorRole.id});
  }

  public remove(user: any): Observable<any> {
    let requestOptions = HttpUtils.buildRequestOptionsForTransferId(user.id);
    return this.http.post("/rest/administration/user/remove", null, requestOptions);
  }

  public canRemove(user: any): boolean {
    return !this.isAdministrator(user);
  }

  public getUserGrid(): Grid {
    return UserGridFactory.newGridInstance(this.loginService.getAvailableRoles());
  }

  public createNewObject(): any {
    let userRole = this.loginService.getUserRole();
    let roles = userRole ? [userRole] : [];
    return {active: true, roles: roles};
  }
}