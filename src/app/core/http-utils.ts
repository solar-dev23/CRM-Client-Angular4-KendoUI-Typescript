import * as _ from "lodash"
import { RequestOptions } from "@angular/http";
import { ObjectModel } from "crm-platform";

export class HttpUtils {

  private constructor() {
    // do nothing
  }

  public static buildRequestOptions(data: any): RequestOptions {
    return ObjectModel.buildRequestOptions(data);
  }

  public static buildRequestOptionsForTransferObject(object: Object): RequestOptions {
    return HttpUtils.buildRequestOptions({object: object});
  }

  public static buildRequestOptionsForTransferId(id: any, data: any = {}): RequestOptions {
    data = _.assign(data, {id: id});
    return HttpUtils.buildRequestOptions(data);
  }
}

