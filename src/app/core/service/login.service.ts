import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { Http, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { PartialObserver } from "rxjs/Observer";
import { Router } from "@angular/router";
import { LocalStorageService } from "angular-2-local-storage";
import { HttpController } from "./http-controller";
import { HttpUtils } from "../http-utils";
import { PERMISSIONS } from "../constants";
import { UserRole } from "../domain/user-role";

@Injectable()
export class LoginService {
  private static AUTH_DATA_KEY: string = "authData";

  private loggedIn: boolean = false;
  private http: HttpController = null;
  private lastError: string;
  private progress: boolean = false;
  private targetPage: string;
  private authData: any;
  private administratorRole: UserRole;
  private userRole: UserRole;

  public constructor(http: Http, private router: Router, private localStorage: LocalStorageService) {
    this.http = <HttpController> http;
    this.setAuthData(this.localStorage.get(LoginService.AUTH_DATA_KEY));
    if (this.authData) {
      this.http.setAccessToken(this.authData.token);
      this.loggedIn = true;
    }
    this.http.addAccessTokenChangeListener((event) => {
      if (!event.newValue && this.authData && event.oldValue === this.authData.token) {
        this.localStorage.remove(LoginService.AUTH_DATA_KEY);
        this.setLoggedIn(false, event.errorText);
      }
    });
    router.events.subscribe((event: any) => {
      if (typeof event.urlAfterRedirects !== "undefined" && event.urlAfterRedirects !== this.targetPage) {
        this.lastError = "";
        this.targetPage = null;
      }
    });
  };

  private setAuthData(authData: any): void {
    this.authData = authData;
    if (this.authData) {
      this.administratorRole = _.find(this.getAvailableRoles(), (role) => {
        return _.indexOf(role.permissions, PERMISSIONS.administration) >= 0;
      });
      this.userRole = _.find(this.getAvailableRoles(), (role) => {
        return _.indexOf(role.permissions, PERMISSIONS.administration) < 0;
      });
    } else {
      this.administratorRole = null;
      this.userRole = null;
    }
  }

  public getUserId(): any {
    return this.authData ? this.authData.userId : null;
  }

  public hasAdministrationPermission(): boolean {
    return this.hasAccess(PERMISSIONS.administration);
  }

  public hasAccess(permission: string): boolean {
    return (this.authData && this.authData.permissions && _.indexOf(this.authData.permissions, permission) >= 0)
      || !permission;
  }

  public getAvailableRoles(): UserRole[] {
    let config = this.authData ? this.authData.config : [];
    return config ? config.roles : [];
  }

  public getUserRole(): UserRole {
    return this.userRole;
  }

  public getAdministratorRole(): UserRole {
    return this.administratorRole;
  }

  public login(username: string, password: string): void {
    this.progress = true;
    this.http.authenticate(username, password).subscribe((authData) => {
      this.localStorage.set(LoginService.AUTH_DATA_KEY, authData);
      this.setAuthData(this.localStorage.get(LoginService.AUTH_DATA_KEY));
      this.setLoggedIn(true);
    }, (error) => {
      this.lastError = error.status === 401 || error.status === 400 ?
        'Invalid username or password' : this.getErrorMessage(error);
      this.loggedIn = false;
      this.progress = false;
    });
  }

  public logout(): void {
    this.progress = true;
    this.http.post('/logout', null).subscribe(() => {
      this.progress = false;
      this.localStorage.remove(LoginService.AUTH_DATA_KEY);
      this.setLoggedIn(false);
    }, () => this.progress = false);
  }

  private resetPasswordByKey(url: string, password): void {
    this.progress = true;
    let activationKey = this.router.parseUrl(this.router.url).queryParams['key'];
    this.http.post(url, null, HttpUtils.buildRequestOptions({key: activationKey, password: password}))
      .map(res => res.json()).subscribe((user) => {
      this.login(user.username, password);
    }, (error) => {
      this.lastError = error.status === 401 || error.status === 400 ? 'Invalid activation key' :
        this.getErrorMessage(error);
      this.progress = false;
    });
  }

  public activate(password: string): void {
    this.resetPasswordByKey("/user/activate-account", password);
  }

  public resetPassword(password: string): void {
    this.resetPasswordByKey("/user/reset-password", password);
  }

  private executeRequest(url: string, options: RequestOptions): Observable<any> {
    this.progress = true;
    return new Observable((observer: PartialObserver<any>) => {
      this.http.post(url, null, options).map(res => res.json()).subscribe((res) => {
        this.lastError = "";
        this.progress = false;
        observer.next(res);
      }, (error) => {
        this.lastError = this.getErrorMessage(error);
        this.progress = false;
        observer.error(error);
      }, () => observer.complete());
    });
  }

  public register(registrationData: any): Observable<any> {
    return this.executeRequest("/user/register", HttpUtils.buildRequestOptionsForTransferObject(registrationData));
  }

  public requestResetPassword(email: string): Observable<any> {
    return this.executeRequest("/user/confirm-reset-password", HttpUtils.buildRequestOptions({email: email}));
  }

  public inProgress(): boolean {
    return this.progress;
  }

  public isLoggedIn(): boolean {
console.log(this.isLoggedIn);    
    return this.loggedIn;
  }

  public getLastError(): string {
    return this.lastError;
  }

  private setLoggedIn(loggedIn: boolean, errorDescription = ''): void {
    this.lastError = errorDescription;
    this.progress = false;
    this.loggedIn = loggedIn;
    this.targetPage = this.isLoggedIn() ? "/" : "/login";
    this.router.navigate([this.targetPage]);
  }

  public resetLastError(): void {
    this.lastError = "";
  }

  private getErrorMessage(error: any): string {
    let errorText;
    if (typeof error._body === 'string') {
      errorText = error._body;
      try {
        let json = JSON.parse(error._body);
        errorText = json && json.error && json.error.message ? json.error.message : errorText;
      } catch (err) {
        // do nothing;
      }
    }
    return errorText || error.statusText || "Server is not responding";
  }
}