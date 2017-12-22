import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()

export class EventEmitterService {
	private emitChangeSource = new Subject<any>();
	changeEmitted$ = this.emitChangeSource.asObservable();

	menuChange(change: any) {
		this.emitChangeSource.next(change);
	}
}