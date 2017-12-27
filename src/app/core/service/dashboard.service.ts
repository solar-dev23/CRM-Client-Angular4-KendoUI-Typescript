import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { HttpUtils } from "../http-utils";
import { LoginService } from "./login.service";

@Injectable()
export class DashboardService {
  public constructor(private http: Http, private loginService: LoginService) {
  };

  public calculate(data: any): Observable<any> {
    let requestOptions = HttpUtils.buildRequestOptionsForTransferObject(data);
    return this.http.post('/rest/dashboard/calculate', null, requestOptions).map(res => {
        return res.json();
    })
  }

  public calculate_v2(data: any): Observable<any> {
    let requestOptions = HttpUtils.buildRequestOptionsForTransferObject(data);
    return this.http.post('/rest/dashboard/calculate/v2', null, requestOptions).map(res => {
        return res.json();
    })
  }
}