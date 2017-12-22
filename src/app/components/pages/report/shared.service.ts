import { ReportSettingParams } from './report.component';
import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SharedService {
  private reportSettingParams = new Subject<ReportSettingParams>();

  constructor() { }

  reportSettingListener(): Observable<ReportSettingParams> {
    return this.reportSettingParams.asObservable();
  }

  updateReportSettingParams(params: ReportSettingParams) {
    this.reportSettingParams.next(params);
  }
}
