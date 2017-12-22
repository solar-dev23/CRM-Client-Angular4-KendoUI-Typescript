import { Component, Input } from "@angular/core";

@Component({
  selector: 'progress-dialog',
  template: `<div class="ma-progress-dialog ma-fill-window-space" *ngIf="progress"></div>`
})
export class ProgressDialogComponent {
  @Input() progress: boolean = false;
}