import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { CONFIG } from '../config';

const api_url = CONFIG.SERVER_URL;

@Injectable()

export class HttpService {
  public statuses: any[];
  public opportunities: any[];
  public headers: Headers;

  constructor(
  	private http: Http
	) {
		this.headers = new Headers({ 'Content-Type': 'application/json' });
  }

  getStatuses () {
      return new Observable((observer) => {
        if(this.statuses) {
          observer.next(this.statuses);
          observer.complete();
        }
        else {
          this.http.get(api_url+'/api/status').subscribe(
            res => {
              this.statuses = res.json();
              observer.next(this.statuses);
              observer.complete();
            }, err => console.log(err)
          )
        }
      })
  }

  getOpportunities () {
      return new Observable((observer) => {
        if(this.opportunities) {
          observer.next(this.opportunities);
          observer.complete();
        }
        else {
          this.http.get(api_url+'/api/opportunity').subscribe(
            res => {
              this.opportunities = res.json();

              observer.next(this.opportunities);
              observer.complete();
            }, err => console.log(err)
          )
        }
      })
  }

  reorderStatus(data) {
      let body = JSON.stringify(data);
      return this.http.post(api_url+'/api/status/reorder', body, {headers: this.headers})
          .map(res => res.json())
  }

  reorderOpportunity(data) {
      let body = JSON.stringify(data);
      return this.http.post(api_url+'/api/opportunity/reorder', body, {headers: this.headers})
          .map(res => res.json())
  }

  createStatus(data) {
      let body = JSON.stringify(data);
      return this.http.post(api_url+'/api/status', body, {headers: this.headers})
          .map(res => res.json())
  }

  updateStatus(data) {
      let body = JSON.stringify(data);
      return this.http.put(api_url+'/api/status', body, {headers: this.headers})
          .map(res => res.json())
  }

  deleteStatus(data) {
      let body = JSON.stringify(data);
      let options = new RequestOptions({
        body: body,
        headers: this.headers,
      });
      return this.http.delete(api_url+'/api/status', options)
          .map(res => res.json())
  }

  createOpportunity(data) {
      let body = JSON.stringify(data);
      return this.http.post(api_url+'/api/opportunity', body, {headers: this.headers})
          .map(res => res.json())
  }

  updateOpportunity(data) {
      let body = JSON.stringify(data);
      return this.http.put(api_url+'/api/opportunity', body, {headers: this.headers})
          .map(res => res.json())
  }

  deleteOpportunity(data) {
      let body = JSON.stringify(data);
      let options = new RequestOptions({
        body: body,
        headers: this.headers,
      });
      return this.http.delete(api_url+'/api/opportunity', options)
          .map(res => res.json())
  }

  archiveOpportunities(data) {
      let body = JSON.stringify(data);
      return this.http.post(api_url+'/api/opportunity/archiveAll', body, {headers: this.headers})
          .map(res => res.json())
  }

  updateReminder(data) {
      let body = JSON.stringify(data);
      return this.http.put(api_url+'/api/reminder', body, {headers: this.headers})
          .map(res => res.json())
  }

  getReminder(data) {
      return this.http.get(api_url+'/api/reminder/one?user_id='+data.user_id+'&opportunity_id='+data.opportunity_id)
          .map(res => res.json())
  }

  calculate(filter: any) {
    return this.http.post(api_url+'/api/dashboard/calculate', filter, { headers: this.headers })
      .map(res => res.json())
  }

  calculate_v2(filter: any) {
    return this.http.post(api_url+'/api/dashboard/calculate/v2', filter, { headers: this.headers })
      .map(res => res.json())
  }

  getUser(data) {
      return this.http.get(api_url+'/api/user/one?id='+data.id)
          .map(res => res.json())
  }

  updateUser(data) {
      let body = JSON.stringify(data);
      return this.http.put(api_url+'/api/user', body, {headers: this.headers})
          .map(res => res.json())    
  }
}
