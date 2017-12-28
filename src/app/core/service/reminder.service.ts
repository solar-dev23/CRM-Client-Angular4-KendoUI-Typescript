import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { HttpUtils } from "../http-utils";

@Injectable()
export class ReminderService {
  public constructor(private http: Http) {
  };

  public updateReminder(data) {
  	let requestOptions = HttpUtils.buildRequestOptionsForTransferObject(data);
  	return this.http.put('/rest/reminder', null, requestOptions).map(res => {
        return res.json();
    })
  }

  public getReminder(data) {
  	return this.http.get('/rest/reminder/one?user_id='+data.user_id+'&opportunity_id='+data.opportunity_id, null).map((res) => res.json());
  }
}