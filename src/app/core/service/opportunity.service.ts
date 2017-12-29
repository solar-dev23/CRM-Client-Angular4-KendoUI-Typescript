import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { HttpUtils } from "../http-utils";
import { DataSourceAdapter, Grid } from "crm-platform";
import { OpportunityGridFactory } from "./opportunity-grid-factory";


@Injectable()
export class OpportunityService extends DataSourceAdapter<any>  {
  public constructor(private http: Http) {
    super();
  };
  
  public read(): Observable<any[]> {
    return this.http.get("/rest/opportunity", null).map((res) => res.json());
  }

  public save(data: any): Observable<any> {
    let requestOptions = HttpUtils.buildRequestOptions(data);
    return this.http.put('/rest/opportunity', null, requestOptions).map(res => {
        return res.json();
    })
  }

  public remove(data: any): Observable<any> {
    let requestOptions = HttpUtils.buildRequestOptions(data);
    return this.http.delete("/rest/opportunity", requestOptions).map(res => {
        return res.json();
    })
  }

  // public getOpportunities () {
  //   return this.http.get("/rest/opportunity", null).map((res) => res.json());
  // }

  // public createOpportunity(data) {
  //   let requestOptions = HttpUtils.buildRequestOptions(data);
  //   return this.http.post('/rest/opportunity', null, requestOptions).map(res => {
  //       return res.json();
  //   })
  // }

  // public updateOpportunity(data) {
  //   let requestOptions = HttpUtils.buildRequestOptions(data);
  //   return this.http.put('/rest/opportunity', null, requestOptions).map(res => {
  //       return res.json();
  //   })
  // }

  // public deleteOpportunity(data) {
  //   let requestOptions = HttpUtils.buildRequestOptions(data);
  //   return this.http.delete("/rest/opportunity", requestOptions).map(res => {
  //       return res.json();
  //   })
  // }

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

  public getOpportunityGrid(): Grid {
    return OpportunityGridFactory.newGridInstance();
  }
}