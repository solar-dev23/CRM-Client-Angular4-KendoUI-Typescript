import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const API_URL = 'https://ma-server-crm-users-app.herokuapp.com/user';//'http://localhost:4300/user';

@Injectable()
export class ImageUploadService {

  constructor(private http: Http) { }

  uploadImage(base64: string): Promise<any> {
    //return this.http.post(API_URL + '/avatar', { base64: base64 }).toPromise();
    return this.http.post(API_URL + '/avatar', { base64: base64 })
    .toPromise()
    .then((response) => {
    	return response.json();
  	});
  }
}
