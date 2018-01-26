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

  public queryCards(state?: any, callback?:any): any {
    var skip=1, pagesize=10, isactive=``;
    if(state!=null){
        skip = state.skip * state.take;
        pagesize = state.take;
    }

    if(state.IsActive!=undefined && state.IsActive !=null){
        isactive=`&isactive=${state.IsActive}`;
    }

    if(callback==null){
        callback=function(){};      
    }

    return this.http
        .get(`/rest/user?skip=${skip}&pagesize=${pagesize}${isactive}`)
        .map(response=> response.json())
        .map(response=>{return {data:response.rows, count:response.count,skip:skip}});
  }

  public update(user: any): Observable<any> {
    let requestOptions = HttpUtils.buildRequestOptionsForTransferObject(user);
    return this.http.post("/rest/user/update", null, requestOptions).map((res) => {
      return res.json();
    });
  }

  public uploadImage(base64: string) {
    let requestOptions = HttpUtils.buildRequestOptions({base64: base64});
    return this.http.post('/rest/user/avatar', null, requestOptions).map(res => {
        return res.json();
    })
  }
}