import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { DataSourceAdapter, Grid } from "crm-platform";
import { HttpUtils } from "../http-utils";
import { LoginService } from "./login.service";
import { AccountGridFactory } from "./account-grid-factory";

@Injectable()
export class AccountService extends DataSourceAdapter<any> {
  public constructor(private http: Http, private loginService: LoginService) {
    super();
  };

  public read(): Observable<any[]> {
    return this.http.get("/rest/account/all", null).map((res) => res.json());
  }

  public save(data: any): Observable<any> {
    let requestOptions = HttpUtils.buildRequestOptionsForTransferObject(data);
    return this.http.post("/rest/account/save", null, requestOptions).map((res) => {
      return res.json();
    });
  }

  public remove(data: any): Observable<any> {
    let requestOptions = HttpUtils.buildRequestOptionsForTransferId(data.id);
    return this.http.delete("/rest/account/remove", requestOptions);
  }

  public getAccountGrid(contacts): Grid {
    return AccountGridFactory.newGridInstance(contacts);
  }

  public uploadDocument(base64: string) {
    let requestOptions = HttpUtils.buildRequestOptions({base64: base64});
    return this.http.post('/rest/account/upload', null, requestOptions).map(res => {
        return res.json();
    })
  }
}