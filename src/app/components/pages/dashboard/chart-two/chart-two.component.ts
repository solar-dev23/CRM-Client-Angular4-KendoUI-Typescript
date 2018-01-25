import { Component, OnInit, Input } from '@angular/core';
import { ValueAxisLabels } from '@progress/kendo-angular-charts';
import { DashboardService, CHART_TYPE } from '../../../../core';

@Component({
  selector: 'app-chart-two',
  templateUrl: './chart-two.component.html',
  styleUrls: ['./chart-two.component.scss']
})

export class ChartTwoComponent implements OnInit {
  @Input() type: string;

  protected chartType = CHART_TYPE;
  // Pie Chart Data
  protected dataFromServer: any[] = [];
  protected pieData: any[] = [1];
  protected valueMarks: any[] = [];

  // Filters
  protected filter: any = {
    currency: 'USD',
    by: 'Status',
    showBy: 'Currency',
    value: 'Sum',
    date_from: new Date(2010, 0, 1),
    date_to: new Date()
  };
  protected currencyList: Array<string> = ['USD', 'EUR', 'All'];
  protected showByList: Array<string> = ['User', 'Company', 'Year', 'Month', 'Status', 'Currency'];
  protected valueList: Array<string> = ['Sum', 'Count'];
  protected min_date: Date = new Date(2010, 0, 1);
  protected max_date: Date = new Date();
  // Axes setting
  public valueAxisLabels: ValueAxisLabels = {
    padding: 3,
    rotation: -45
  }

  constructor(private dashboardService: DashboardService) {
  }

  ngOnInit() {
    if (this.type == undefined) this.type = this.chartType.LINE;
    this.onFilterChange();
  }

  // Draw Pie Chart
  protected updatePieChart() {  //Update Pie Chart following the filters
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

  protected onFilterChange() {
    this.valueList = ['Sum', 'Count'];
    if (this.filter.by == 'Currency') {
      this.filter.value = 'Count';
      this.valueList = ['Count'];
      this.filter.currency = 'All';
    }

    this.dashboardService.calculate_v2(this.filter).subscribe(res => {
      this.dataFromServer = res.data;
      this.updatePieChart();
    })    
  }
  protected labelContent(e: any): string {
    return e.category;
  }
}
