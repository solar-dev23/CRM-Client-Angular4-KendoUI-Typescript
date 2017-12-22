import { PAGES } from './pages';
import { SharedService } from './shared.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
    public pages = PAGES;
    public currentPage = this.pages[1];

    // Setting Popup Config
    public showSetting: boolean;
    public alignments: string[] = [
        'Center',
        'Left',
        'Right'
    ]
    public reportParams = new ReportSettingParams();

    constructor(
        private router: Router,
        private sharedServicve: SharedService
    ) {
        this.router.navigate(['/report', this.currentPage.title]);        
    }

    ngOnInit() {

    }

    pageChange(page) {
        this.router.navigate(['/report', page.title]);
    }


    onSetting() {
        this.showSetting = true;
    }

    saveSetting() {
        this.showSetting = false;
        this.sharedServicve.updateReportSettingParams(this.reportParams);
    }
}

export class ReportSettingParams {
    company = {
        visible: true,
        value: ''
    };
    reportName = {
        visible: true,
        value: ''
    };
    address = {
        visible: true,
        value: ''
    };
    note = {
        visible: true,
        value: ''
    }
    includeDateInPrint: boolean = true;
    includeCreatedByUser: boolean = true;
    includeCreatedDate: boolean = true;
    includeCreatedTime: boolean = true;
    includeNumberOfPages: boolean = true;
    headerAlignment: string = 'Center';
    footerAlignment: string = 'Center';
}