import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { HttpUtils } from "../http-utils";
import { DataSourceAdapter } from "crm-platform";

@Injectable()
export class AddressService extends DataSourceAdapter<any> {
  public constructor(private http: Http) {
    super();
  };

  public read(): Observable<any[]> {
    return this.http.get("/rest/address/all", null).map((res) => res.json());
  }

  public save(data: any): Observable<any> {
    let requestOptions = HttpUtils.buildRequestOptionsForTransferObject(data);
    return this.http.post("/rest/address/save", null, requestOptions).map((res) => {
      return res.json();
    });
  }

  public remove(data: any): Observable<any> {
    let requestOptions = HttpUtils.buildRequestOptionsForTransferId(data.id);
    return this.http.delete("/rest/address/remove", requestOptions);
  }

  public getById(id: any): Observable<any> {
//     let requestOptions = HttpUtils.buildRequestOptionsForTransferId(id);
// console.log(requestOptions);    
    return this.http.get("/rest/address/"+id, null).map((res) => res.json());
  }
}