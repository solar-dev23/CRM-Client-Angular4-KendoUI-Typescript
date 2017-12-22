import { HttpService } from '../../../services/http.service';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ValueAxisLabels } from '@progress/kendo-angular-charts';

@Component({
  selector: 'report-chart-two',
  templateUrl: './chart-two.component.html',
  styleUrls: ['./chart-two.component.scss']
})
export class ReportChartTwoComponent implements OnInit {
  Type = {
    BAR_VERTICAL: 'bar-vert',
    BAR_HORIZONTAL: 'bar-horz',
    LINE: 'line',
  }

  @Input() type: string;
  @Input() filter: any;
  @Input() showFilters: boolean = false;

  isLoading: boolean;

  // Pie Chart Data
  dataFromServer: any[] = [];
  pieData: any[] = [1];
  valueMarks: any[] = [];
  colors = ["#ff6358", "#ffd246", "#78d237", "#28b4c8", "#2d73f5", "#aa46be"];

  currencyList: Array<string> = ['USD', 'EUR', 'All'];
  showByList: Array<string> = ['User', 'Company', 'Year', 'Month', 'Status', 'Currency'];
  valueList: Array<string> = ['Sum', 'Count'];

  min_date: Date = new Date(2010, 0, 1);
  max_date: Date = new Date();

  // Axes setting
  public valueAxisLabels: ValueAxisLabels = {
    padding: 3,
    rotation: -45
  }

  constructor(private httpService: HttpService) {

  }

  ngOnInit() {
    if (this.type == undefined) this.type = this.Type.LINE;
    this.onFilterChange();
  }

  // Draw Pie Chart
  updatePieChart() {  //Update Pie Chart following the filters
    this.pieData = [];
    this.valueMarks = [];

    let fieldToShow = 'usd';
    if (this.filter.value == 'Sum') fieldToShow = 'sum';
    if (this.filter.value == 'Count') fieldToShow = 'count';

    this.dataFromServer.forEach(dataRow => {
      // if (this.filter.showBy == 'Currency') {
      //   let value = dataPoint.count;
      //   this.pieData.push({ category: dataPoint.name, value: value });
      //   let temp = {
      //     "label": dataPoint.name,
      //     "value": value
      //   }
      //   this.valueMarks.push(temp);
      // } else {
      let series = [];
      dataRow.data.forEach(dataPoint => {
        let value = Math.round(dataPoint[fieldToShow] * 100) / 100
        series.push({ category: dataPoint.name, value: value });
        let temp = {
          "label": dataPoint.name,
          "value": value
        }
      });
      this.pieData.push({
        name: dataRow.name,
        series: series
      });
      // }
    });

    if (this.pieData.length == 0) {
      this.pieData = [1];
    }
  }

  getBackgroundColor(index) {
    return this.colors[index % 6];
  }
  onFilterChange() {
    this.valueList = ['Sum', 'Count'];
    if (this.filter.by == 'Currency') {
      this.filter.value = 'Count';
      this.valueList = ['Count'];
      this.filter.currency = 'All';
    }
    this.isLoading = true;
    this.httpService.calculate_v2(this.filter).subscribe(res => {
      this.isLoading = false;
      this.dataFromServer = res.data;
      this.updatePieChart();
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.type && Object.keys(changes).length == 1) return;
    this.onFilterChange();
  }

  public labelContent(e: any): string {
    return e.category;
  }
}
