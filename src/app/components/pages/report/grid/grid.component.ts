import { PAGES } from '../pages';
import { ReportSettingParams } from '../report.component';
import { SharedService } from '../shared.service';
import { HttpService } from '../../../services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { GridDataResult, PageChangeEvent, RowClassArgs } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { DatePipe } from '@angular/common';

declare var $: any;
var gridSize: number = 0;
var self;

@Component({
  selector: 'report-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})

export class ReportGridComponent implements OnInit {
  @ViewChild('report') reportGridComponent: any
  reportParams = new ReportSettingParams();

  filename = "Report";

  paperSize: string = 'Letter';
  reportTitle: string;
  pages = PAGES;
  pageIndex: number;

  dataFromServer: any[] = [];

  gridData: any[] = []; // Grid Source Calculated
  gridView: GridDataResult; // Grid View items
  public state: State = {
    skip: 0,
    take: 10
  };
  totalValue: number = 0;

  filter = {
    currency: 'USD',
    by: 'Status',
    showBy: 'Currency',
    value: 'Sum',
    date_from: new Date(2010, 0, 1),
    date_to: new Date()
  };
  min_date: Date = new Date(2010, 0, 1);
  max_date: Date = new Date();

  reportTime: Date = new Date();

  isLoading: boolean;

  printMode: boolean;
  viewMode: string = 'grid';

  // Chart Config
  chartTypes = [
    { display: 'Pie chart', value: 'pie', type: 'default' },
    { display: 'Donut chart', value: 'donut', type: 'default' },
    { display: 'Line chart', value: 'line', type: 'default' },
    { display: 'Funnel chart', value: 'funnel', type: 'default' },
    { display: 'Bar chart horizontal', value: 'bar-horz', type: 'default' },
    { display: 'Bar chart vertical', value: 'bar-vert', type: 'default' },
    { display: 'Line chart', value: 'line', type: 'double-axis' },
    { display: 'Bar chart horizontal', value: 'bar-horz', type: 'double-axis' },
    { display: 'Bar chart vertical', value: 'bar-vert', type: 'double-axis' }
  ];
  availableChartTypes = [];
  chartType: any = this.chartTypes[0];


  constructor(private datePipe: DatePipe, private route: ActivatedRoute, private httpService: HttpService, private sharedService: SharedService, private router: Router, private _ngZone: NgZone) {
    this.sharedService.reportSettingListener().subscribe(params => {
      this.reportParams = $.extend(true, {}, params); // Deep Copy
    })
    self = this;
  }

  ngOnInit() {
    gridSize = 0;
    this.gridData = [];
    this.route.queryParamMap.subscribe(params => {
      this.printMode = params.get('printMode') == '1' ? true : false;
      if (this.printMode) $('#header').addClass('hidden');
      else $('#header').removeClass('hidden');
    })
    this.route.params.subscribe(params => {
      this.reportTime = new Date();
      this.page = 1;
      this.reportTitle = params['page'];

      this.pageIndex = this.pages.map(page => page.title).indexOf(this.reportTitle);
      // Set filter from page title
      this.filter.value = this.pages[this.pageIndex].value;
      this.filter.showBy = this.pages[this.pageIndex].showBy;
      this.filter.by = this.pages[this.pageIndex].by;

      // For ngOnChange in charts
      this.filter = Object.assign({}, this.filter);
      // Filter Chart Category
      let chartCategory = 'default';
      if (this.pages[this.pageIndex].by != this.pages[this.pageIndex].showBy) chartCategory = 'double-axis';
      this.availableChartTypes = this.chartTypes.filter(e => e.type == chartCategory);
      this.chartType = this.availableChartTypes[0];

      this.onFilterChange();
    })
  }

  onFilterChange() {
    this.isLoading = true;
    this.state.skip = 0; // Go to first page
    this.httpService.calculate_v2(this.filter).subscribe(res => {
      this.isLoading = false;
      this.dataFromServer = res.data;
      this.calculateGridData();
    })
  }

  columnList: string[] = [];
  calculateGridData() {
    this.gridData = [];
    this.columnList = [];
    this.totalValue = 0;
    this.dataFromServer.forEach(dataRow => {
      let row: any = {};
      if (this.pages[this.pageIndex].by != this.pages[this.pageIndex].showBy) {
        row.name = dataRow.name;
        row.total = 0;
        dataRow.data.forEach(element => {
          if (this.columnList.indexOf(element.name) == -1) this.columnList.push(element.name);
          element.name = element.name.toString().replace('/', '_');
          if (this.filter.value == 'Count') {
            row['_' + element.name] = element.count;
            row.total += element.count;
          }
          else {
            row['_' + element.name] = this.formatCurrency(element.sum);
            row.total += element.sum;
          }
        });
        this.totalValue += row.total;
        row.total = this.formatCurrency(row.total);
        this.gridData.push(row);
      } else {
        let data = dataRow.data;
        data.forEach(element => {
          let row: any = {};
          row.name = element.name;
          console.log(this.filter.value);
          if (this.filter.value == 'Count') row.total = element.count;
          else row.total = element.sum;
          this.totalValue += row.total;
          if (this.filter.value != 'Count') row.total = this.formatCurrency(row.total);
          this.gridData.push(row);
        });
      }
    });
    if (this.columnList.length > 0) { // Sort Column
      if (this.filter.by == 'Year') this.columnList.sort(); // Year Column Sort
      if (this.filter.by == 'Month') {
        this.columnList.sort((left, right) => { return Date.parse(left) - Date.parse(right) });
      }
    }
    this.gridData.push({
      name: 'Total',
      total: this.filter.value == 'Count' ? this.totalValue : this.formatCurrency(this.totalValue)
    })
    gridSize = this.gridData.length;
    this.pageCount = Math.ceil(gridSize / 10);
    this.updateGridView();
  }

  getIdentifier(id) {
    return '_' + id.toString().replace('/', '_');
  }

  page: number = 1;
  pageCount: number = 1;
  pageChange(event: PageChangeEvent): void { // On Pagination
    this.state = event;
    this.page = (event.skip / event.take) + 1;
    this.updateGridView();
  }

  updateGridView(): void { // Update Grid View Data
    this.gridView = {
      data: this.gridData.slice(this.state.skip, this.state.skip + this.state.take),
      // data: this.gridData.slice(),
      total: this.gridData.length
    };
  }

  formatCurrency(val) {
    return val;
  }

  rowWhite: boolean = false;
  rowCallback(context: RowClassArgs) { // Grid Row Class
    const isLastRow = context.index == gridSize - 1;
    return {
      lastRow: isLastRow,
      white: self.rowWhite
    };
  }

  getTopMargin() {
    let margin = 0;
    if (this.reportParams.company.visible && this.reportParams.company.value != '') margin += 1;
    if (this.reportParams.address.visible && this.reportParams.address.value != '') margin += .5;
    if (this.reportParams.reportName.visible) margin += 1.2;
    if (this.reportParams.includeDateInPrint) margin += .8;

    return margin + 'cm';
  }

  getHeaderAlignmentClass() {
    return this.reportParams.headerAlignment;
  }
  getFooterAlignmentClass() {
    return this.reportParams.footerAlignment;
  }

  isPrintPopupOpen: boolean = false;
  showPrintPopup() {
    this.isPrintPopupOpen = true;
    this.rowWhite = true;
    this.reportGridComponent.export();
  }

  pdfData: string = "";
  pdfExportDone(pdfData) {
    this._ngZone.run(() => {
      this.pdfData = pdfData;
      console.log(pdfData, 'pdfExportDone');
    });
  }

  saveAsPDF() {
    this.rowWhite = false;
    this.reportGridComponent.saveAsPDF();
    setTimeout(function () {
      if (self.isPrintPopupOpen) self.rowWhite = true;
    }, 1000);
  }

  landscapeMode: boolean = false;
  orientationChanged(orientation: string) {
    this.landscapeMode = orientation == 'Landscape' ? true : false;
    setTimeout(() => {
      this.reportGridComponent.export();
    }, 500);
  }

  footerStyle() {
    let colorObj = {};
    if (this.rowWhite) colorObj = {
      'color': '#333'
    }

    return colorObj;
  }

  public allData(): ExcelExportData {
    console.log(self.gridData, 'ExcelExport Data');
    const result: ExcelExportData = {
      data: process(self.gridData, {}).data,
    };

    return result;
  }

  isOpenSaveAs: boolean = false;
  saveMode: string = '';

  openSaveAs(mode) {
    this.isOpenSaveAs = true;
    this.saveMode = mode;
  }

  saveGrid() {
    this.paperSize = 'auto';
    const landscapeMode = this.landscapeMode;
    this.landscapeMode = false;
    setTimeout(() => {
      switch (this.saveMode) {
        case 'pdf':
          this.reportGridComponent.saveAsPDF();
          break;
        case 'excel':
          this.reportGridComponent.saveAsExcel();
          break;
      }
      setTimeout(() => {
        this.paperSize = 'Letter';
        this.landscapeMode = landscapeMode;
      }, 1000);
    }, 500);

    this.isOpenSaveAs = false;
  }

  public onExcelExport(e: any): void {
    const rows = e.workbook.sheets[0].rows;
    const columns = e.workbook.sheets[0].columns;
    console.log(e.workbook.sheets[0], 'onExcelExport');

    const colCount = columns.length;

    if (this.reportParams.includeDateInPrint) {
      let date_from = this.datePipe.transform(this.filter.date_from, 'shortDate');
      let date_to = this.datePipe.transform(this.filter.date_to, 'shortDate');
      let headerVal = date_from + ' - ' + date_to;
      this.insertHeaderToExcel(rows, headerVal, colCount)
    }
    if (this.reportParams.reportName.visible) {
      let headerVal = this.reportParams.reportName.value ? this.reportParams.reportName.value : this.reportTitle;
      this.insertHeaderToExcel(rows, headerVal.toUpperCase(), colCount)
    }
    if (this.reportParams.address.visible && this.reportParams.address.value != '') {
      let headerVal = this.reportParams.address.value;
      this.insertHeaderToExcel(rows, headerVal, colCount)
    }
    if (this.reportParams.company.visible && this.reportParams.company.value != '') {
      let headerVal = this.reportParams.company.value;
      this.insertHeaderToExcel(rows, headerVal, colCount)
    }
    this.insertFooterToExcel(rows, colCount);
    if (this.reportParams.note.visible) {
      let footerCell = {
        value: this.reportParams.note.value,
        colSpan: colCount,
        color: '#000'
      }
      let footerRow: any = {
        type: 'data',
        cells: [footerCell]
      };
      footerRow.cells[0].hAlign = this.getFooterAlignmentClass().toLowerCase();
      rows.push(footerRow);
    }
  }

  insertHeaderToExcel(rows, value, colCount) {
    let headerCell = {
      value: value,
      colSpan: colCount,
      color: '#000'
    }
    let headerRow = {
      type: 'header',
      cells: [headerCell]
    };
    rows.unshift(headerRow);
    rows[0].cells[0].hAlign = this.getHeaderAlignmentClass().toLowerCase();
  }

  insertFooterToExcel(rows, colCount) {
    let value = '';
    let isFooter = false;
    if (this.reportParams.includeCreatedByUser || this.reportParams.includeCreatedDate || this.reportParams.includeCreatedTime) {
      value += 'Created';
      isFooter = true;
    }
    if (this.reportParams.includeCreatedByUser) {
      value += ' by Mike Myers';
      isFooter = true;
    }
    if (this.reportParams.includeCreatedDate || this.reportParams.includeCreatedTime) {
      value += ' on ';
      isFooter = true;
    }
    if (this.reportParams.includeCreatedDate) {
      let date = this.datePipe.transform(this.reportTime, 'shortDate');
      value += date;
    }
    if (this.reportParams.includeCreatedTime) {
      let time = this.datePipe.transform(this.reportTime, 'H:mm a Z');
      value += ' ' + time;
    }
    let footerCell = {
      value: value,
      colSpan: colCount,
      color: '#000'
    }
    let footerRow: any = {
      type: 'data',
      cells: [footerCell]
    };
    footerRow.cells[0].hAlign = this.getFooterAlignmentClass().toLowerCase();
    rows.push(footerRow);
  }
}