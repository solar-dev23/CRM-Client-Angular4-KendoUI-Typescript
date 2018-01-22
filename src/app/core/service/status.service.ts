import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { HttpUtils } from "../http-utils";

@Injectable()
export class StatusService {
  private static STATUS_DATA_KEY: string = "statusData";

  public constructor(private http: Http) {
  };

  public read(): Observable<any[]> {
    return this.http.get("/rest/status/all", null).map((res) => res.json());
  }

  public save(data: any): Observable<any> {
    let requestOptions = HttpUtils.buildRequestOptionsForTransferObject(data);
    return this.http.post('/rest/status/save', null, requestOptions).map(res => {
        return res.json();
    })
  }

  public remove(data: any): Observable<any> {
    let requestOptions = HttpUtils.buildRequestOptions(data);
    return this.http.delete("/rest/status/remove", requestOptions).map(res => {
        return res.json();
    })
  }

  public reorderStatus(data) {
  	let requestOptions = HttpUtils.buildRequestOptions(data);
    return this.http.post('/rest/status/reorder', null, requestOptions).map(res => {
        return res.json();
    })
  }
}