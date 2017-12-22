import { Injectable } from "@angular/core";
import {
  Http,
  ConnectionBackend,
  RequestOptions,
  Request,
  RequestOptionsArgs,
  Response,
  Headers,
  RequestMethod,
  BaseRequestOptions
} from "@angular/http";
import { Observable } from "rxjs";
import { PartialObserver } from "rxjs/Observer";
import { EventEmitter } from "events";

@Injectable()
export class HttpController extends Http {

  static EVENTS: any = {
    access_token_changed: 'access_token_changed'
  };

  private accessToken: string;

  private eventEmitter: EventEmitter = new EventEmitter();

  private serverUrl: null;

  public statuses: any[];
  public opportunities: any[];
  public headers: Headers;

  public constructor(backend: ConnectionBackend, defaultOptions: RequestOptions) {
    super(backend, defaultOptions);
    this.headers = new Headers({ 'Content-Type': 'application/json' });
  }

  private getServerUrl(url): Observable<string> {
    return new Observable((observer: PartialObserver<any>) => {
      if (!this.serverUrl) {
        let options = new RequestOptions();
        options.method = RequestMethod.Get;
        super.request("/config", options).map(res => {
          this.serverUrl = res.json().server_url;
          return `${this.serverUrl}${url}`;
        }).subscribe((url) => {
          observer.next(url);
          observer.complete();
        }, (error: any | Response) => observer.error(error));
      } else {
        observer.next(`${this.serverUrl}${url}`);
        observer.complete();
      }
    });
  }

  public setAccessToken(accessToken: string, error: string = '') {
    if (this.accessToken !== accessToken) {
      let event = {oldValue: this.accessToken, newValue: accessToken, errorText: error};
      this.accessToken = accessToken;
      this.eventEmitter.emit(HttpController.EVENTS.access_token_changed, event);
    }
  }

  private static getAuthenticationRequestOptions(body: String): RequestOptions {
    let refreshOptions = new BaseRequestOptions();
    refreshOptions.method = RequestMethod.Post;
    refreshOptions.body = body;
    refreshOptions.headers = new Headers({"Content-Type": "application/json"});
    return refreshOptions;
  }

  private static isInvalidTokenError(error: any | Response): boolean {
    return error instanceof Response && (<Response> error).status === 401;
  }

  private handleHttpError(error: any | Response, observer: PartialObserver<Response>) {
    if (HttpController.isInvalidTokenError(error)) {
      this.setAccessToken(null, 'Session is expired');
    }
    observer.error(error);
  }

  private setAuthorizationHeader(url: string | Request, options?: RequestOptionsArgs) {
    if (this.accessToken) {
      let headers = url instanceof Request ? (<Request> url).headers : options.headers;
      headers.set("Authorization", "Bearer " + this.accessToken);
    }
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    let localUrl = typeof url !== "string" ? (<Request> url).url : url;
    return new Observable((observer: PartialObserver<any>) => {
      return this.getServerUrl(localUrl).flatMap((remoteUrl) => {
          if (typeof url !== "string") {
            (<Request> url).url = remoteUrl;
          } else {
            url = remoteUrl;
          }
          this.setAuthorizationHeader(url, options);
          return super.request(url, options)
        }
      ).subscribe((res) => observer.next(res), (error: any | Response) => this.handleHttpError(error, observer),
        () => observer.complete());
    });
  }


  public authenticate(username: string, password: string): Observable<Request> {
    return new Observable((observer: PartialObserver<any>) => {
      let options = HttpController.getAuthenticationRequestOptions(JSON.stringify({
        username: username,
        password: password
      }));
      this.getServerUrl("/login").flatMap(url => super.request(url, options)).map((res: Response) => res.json())
        .subscribe((res: any) => {
          this.setAccessToken(res.token);
          observer.next(res);
        }, (error: any | Request) => observer.error(error), () => observer.complete());
    });
  }

  private addListener(event: string, listener: Function): void {
    this.eventEmitter.on(event, listener);
    return this.removeListener.bind(this, event, listener);
  }

  private removeListener(event, listener): void {
    this.eventEmitter.removeListener(event, listener);
  }

  public addAccessTokenChangeListener(listener): void {
    return this.addListener(HttpController.EVENTS.access_token_changed, listener);
  }

  // getStatuses () {
  //   return new Observable((observer) => {
  //     if(this.statuses) {
  //       observer.next(this.statuses);
  //       observer.complete();
  //     }
  //     else {
  //       this.getServerUrl("/login").get(api_url+'/api/status').subscribe(
  //         res => {
  //           this.statuses = res.json();
  //           observer.next(this.statuses);
  //           observer.complete();
  //         }, err => console.log(err)
  //       )
  //     }
  //   })
  // }

  // getOpportunities () {
  //     return new Observable((observer) => {
  //       if(this.opportunities) {
  //         observer.next(this.opportunities);
  //         observer.complete();
  //       }
  //       else {
  //         this.http.get(api_url+'/api/opportunity').subscribe(
  //           res => {
  //             this.opportunities = res.json();

  //             observer.next(this.opportunities);
  //             observer.complete();
  //           }, err => console.log(err)
  //         )
  //       }
  //     })
  // }

  // reorderStatus(data) {
  //     let body = JSON.stringify(data);
  //     return this.http.post(api_url+'/api/status/reorder', body, {headers: this.headers})
  //         .map(res => res.json())
  // }

  // reorderOpportunity(data) {
  //     let body = JSON.stringify(data);
  //     return this.http.post(api_url+'/api/opportunity/reorder', body, {headers: this.headers})
  //         .map(res => res.json())
  // }

  // createStatus(data) {
  //     let body = JSON.stringify(data);
  //     return this.http.post(api_url+'/api/status', body, {headers: this.headers})
  //         .map(res => res.json())
  // }

  // updateStatus(data) {
  //     let body = JSON.stringify(data);
  //     return this.http.put(api_url+'/api/status', body, {headers: this.headers})
  //         .map(res => res.json())
  // }

  // deleteStatus(data) {
  //     let body = JSON.stringify(data);
  //     let options = new RequestOptions({
  //       body: body,
  //       headers: this.headers,
  //     });
  //     return this.http.delete(api_url+'/api/status', options)
  //         .map(res => res.json())
  // }

  // createOpportunity(data) {
  //     let body = JSON.stringify(data);
  //     return this.http.post(api_url+'/api/opportunity', body, {headers: this.headers})
  //         .map(res => res.json())
  // }

  // updateOpportunity(data) {
  //     let body = JSON.stringify(data);
  //     return this.http.put(api_url+'/api/opportunity', body, {headers: this.headers})
  //         .map(res => res.json())
  // }

  // deleteOpportunity(data) {
  //     let body = JSON.stringify(data);
  //     let options = new RequestOptions({
  //       body: body,
  //       headers: this.headers,
  //     });
  //     return this.http.delete(api_url+'/api/opportunity', options)
  //         .map(res => res.json())
  // }

  // archiveOpportunities(data) {
  //     let body = JSON.stringify(data);
  //     return this.http.post(api_url+'/api/opportunity/archiveAll', body, {headers: this.headers})
  //         .map(res => res.json())
  // }

  // updateReminder(data) {
  //     let body = JSON.stringify(data);
  //     return this.http.put(api_url+'/api/reminder', body, {headers: this.headers})
  //         .map(res => res.json())
  // }

  // getReminder(data) {
  //     return this.http.get(api_url+'/api/reminder/one?user_id='+data.user_id+'&opportunity_id='+data.opportunity_id)
  //         .map(res => res.json())
  // }

  // calculate(filter: any) {
  //   return this.http.post(api_url+'/api/dashboard/calculate', filter, { headers: this.headers })
  //     .map(res => res.json())
  // }

  // calculate_v2(filter: any) {
  //   return this.http.post(api_url+'/api/dashboard/calculate/v2', filter, { headers: this.headers })
  //     .map(res => res.json())
  // }

  // getUser(data) {
  //     return this.http.get(api_url+'/api/user/one?id='+data.id)
  //         .map(res => res.json())
  // }

  // updateUser(data) {
  //     let body = JSON.stringify(data);
  //     return this.http.put(api_url+'/api/user', body, {headers: this.headers})
  //         .map(res => res.json())    
  // }
}