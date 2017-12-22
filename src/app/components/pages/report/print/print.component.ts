import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ReportSettingParams } from '../report.component';
import { DomSanitizer } from '@angular/platform-browser';

import b64toBlob from 'b64-to-blob';

declare var $: any;

@Component({
  selector: 'report-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class ReportPrintComponent implements OnInit {
  @Input() pdfData: string = "";
  @Input() open: boolean;
  @Output() closed = new EventEmitter();
  @Output() saveAsPDF = new EventEmitter();
  @Output() orientationChanged = new EventEmitter();
  @Output() printClicked = new EventEmitter();

  orientations: string[] = ['Portrait', 'Landscape'];
  orientation: string = 'Portrait';

  transformedURL: any;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    console.log('print component ngoninit');
  }

  ngOnChanges(changes: SimpleChanges) {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log(changes, 'print onchanges');
    if (changes.pdfData) {
      this.transformedURL = this.transform(this.pdfData);
    }
  }

  close(state) {
    this.closed.emit();
  }

  orientationChange() {
    console.log('orientationChange', this.orientation);
    this.orientationChanged.emit(this.orientation);
  }
  transform(url) {
    const b64 = url.replace("data:application/pdf;base64,", "");
    
    const contentType = "application/pdf",
      blob = b64toBlob(b64, contentType),
      blobUrl = URL.createObjectURL(blob);

    const newUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
    console.log('transform', newUrl)
    return newUrl;
  }
  savePDF() {
    this.saveAsPDF.emit();
  }

  print() {
    $("#pdfFrame").get(0).focus();
    $("#pdfFrame").get(0).contentWindow.print();
  }
}
