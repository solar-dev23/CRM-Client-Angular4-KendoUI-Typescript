import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { HttpUtils } from "../http-utils";
import { LocalStorageService } from "angular-2-local-storage";

@Injectable()
export class StatusService {
  private static STATUS_DATA_KEY: string = "statusData";

  public constructor(private http: Http, private localStorage: LocalStorageService) {
    this.read().subscribe(res => {
      this.localStorage.set(StatusService.STATUS_DATA_KEY, res);
    });
  };

  public read(): Observable<any[]> {
    return this.http.get("/rest/status", null).map((res) => res.json());
  }

  public save(data: any): Observable<any> {
    let requestOptions = HttpUtils.buildRequestOptions(data);
    return this.http.post('/rest/status', null, requestOptions).map(res => {
        return res.json();
    })
  }

  public remove(data: any): Observable<any> {
    let requestOptions = HttpUtils.buildRequestOptions(data);
    return this.http.delete("/rest/status", requestOptions).map(res => {
        return res.json();
    })
  }

  // public getStatuses () {
  //   return this.http.get("/rest/status", null).map((res) => res.json());
  // }

  // public createStatus(data) {
  // 	let requestOptions = HttpUtils.buildRequestOptions(data);
  //   return this.http.post('/rest/status', null, requestOptions).map(res => {
  //       return res.json();
  //   })
  // }

  // public updateStatus(data) {
  //   let requestOptions = HttpUtils.buildRequestOptions(data);
  //   return this.http.put('/rest/status', null, requestOptions).map(res => {
  //       return res.json();
  //   })
  // }

  // public deleteStatus(data) {
  // 	let requestOptions = HttpUtils.buildRequestOptions(data);
  //   return this.http.delete("/rest/status", requestOptions).map(res => {
  //       return res.json();
  //   })
  // }

  public reorderStatus(data) {
  	let requestOptions = HttpUtils.buildRequestOptions(data);
    return this.http.post('/rest/status/reorder', null, requestOptions).map(res => {
        return res.json();
    })
  }

  public getAllStatuses() {
    return this.localStorage.get(StatusService.STATUS_DATA_KEY);
  }
}