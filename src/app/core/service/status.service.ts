import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { HttpUtils } from "../http-utils";

@Injectable()
export class StatusService {
  public constructor(private http: Http) {
  };

  public getStatuses () {
    return this.http.get("/rest/status", null).map((res) => res.json());
  }

  public createStatus(data) {
  	let requestOptions = HttpUtils.buildRequestOptions(data);
    return this.http.post('/rest/status', null, requestOptions).map(res => {
        return res.json();
    })
  }

  public updateStatus(data) {
    let requestOptions = HttpUtils.buildRequestOptions(data);
    return this.http.put('/rest/status', null, requestOptions).map(res => {
        return res.json();
    })
  }

  public deleteStatus(data) {
  	let requestOptions = HttpUtils.buildRequestOptions(data);
    return this.http.delete("/rest/status", requestOptions).map(res => {
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