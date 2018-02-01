import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { DataSourceAdapter } from "crm-platform";
import { HttpUtils } from "../http-utils";

@Injectable()
export class RoleService extends DataSourceAdapter<any> {
  public constructor(private http: Http) {
    super();
  };

  public read(): Observable<any[]> {
    return this.http.get("/rest/role/all", null).map((res) => res.json());
  }

  public save(data: any): Observable<any> {
    let requestOptions = HttpUtils.buildRequestOptionsForTransferObject(data);
    return this.http.post("/rest/role/save", null, requestOptions).map((res) => {
      return res.json();
    });
  }

  public remove(data: any): Observable<any> {
    let requestOptions = HttpUtils.buildRequestOptionsForTransferId(data.id);
    return this.http.delete("/rest/role/remove", requestOptions);
  }
}