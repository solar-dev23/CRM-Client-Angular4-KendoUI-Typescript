import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { DataSourceAdapter, Grid } from "crm-platform";
import { HttpUtils } from "../http-utils";
import { LoginService } from "./login.service";
import { ContactGridFactory } from "./contact-grid-factory";
import { AccountService } from "./account.service";

@Injectable()
export class ContactService extends DataSourceAdapter<any> {
  public constructor(private http: Http, private loginService: LoginService, private accountService: AccountService) {
    super();
  };

  public read(): Observable<any[]> {
    return this.http.get("/rest/contact/all", null).map((res) => res.json());
  }

  public save(data: any): Observable<any> {
    let requestOptions = HttpUtils.buildRequestOptionsForTransferObject(data);
    return this.http.post("/rest/contact/save", null, requestOptions).map((res) => {
      return res.json();
    });
  }

  public remove(data: any): Observable<any> {
    let requestOptions = HttpUtils.buildRequestOptionsForTransferId(data.id);
    return this.http.delete("/rest/contact/remove", requestOptions);
  }

  public getContactGrid(accounts): Grid {
    return ContactGridFactory.newGridInstance(accounts);
  }
}