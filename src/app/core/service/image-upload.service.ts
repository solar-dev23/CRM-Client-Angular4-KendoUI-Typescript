import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { HttpUtils } from "../http-utils";

@Injectable()
export class ImageUploadService {

  constructor(private http: Http) {}

  uploadImage(base64: string) {
  	let requestOptions = HttpUtils.buildRequestOptions({base64: base64});
    return this.http.post('/rest/user/avatar', null, requestOptions).map(res => {
        return res.json();
    })
  }
}
