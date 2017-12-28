import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { HttpUtils } from "../http-utils";

@Injectable()
export class OpportunityService {
  public constructor(private http: Http) {
  };

  public getOpportunities () {
    return this.http.get("/rest/opportunity", null).map((res) => res.json());
  }

  public createOpportunity(data) {
    let requestOptions = HttpUtils.buildRequestOptions(data);
    return this.http.post('/rest/opportunity', null, requestOptions).map(res => {
        return res.json();
    })
  }

  public updateOpportunity(data) {
    let requestOptions = HttpUtils.buildRequestOptions(data);
    return this.http.put('/rest/opportunity', null, requestOptions).map(res => {
        return res.json();
    })
  }

  public deleteOpportunity(data) {
    let requestOptions = HttpUtils.buildRequestOptions(data);
    return this.http.delete("/rest/opportunity", requestOptions).map(res => {
        return res.json();
    })
  }

  public reorderOpportunity(data) {
    let requestOptions = HttpUtils.buildRequestOptions(data);
    return this.http.post('/rest/opportunity/reorder', null, requestOptions).map(res => {
        return res.json();
    })
  }

  public archiveOpportunities(data) {
    let requestOptions = HttpUtils.buildRequestOptions(data);
    return this.http.post('/rest/opportunity/archiveAll', null, requestOptions).map(res => {
        return res.json();
    })
  }
}