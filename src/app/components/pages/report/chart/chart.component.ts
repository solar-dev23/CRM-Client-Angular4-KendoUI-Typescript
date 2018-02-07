import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ValueAxisLabels } from '@progress/kendo-angular-charts';
import { DashboardService, CHART_TYPE, COLORS } from '../../../../core';

@Component({
  selector: 'report-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})

export class ReportChartComponent implements OnInit {
  @Input() type: string;
  @Input() filter: any;
  @Input() showFilters: boolean = false;

  protected chartType = CHART_TYPE;

  // Pie Chart Data
  protected dataFromServer: any[] = [];
  protected pieData: any[] = [1];
  protected pieData2: any = [1];
  protected valueMarks: any[] = [];
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
    if (this.type == undefined) this.type = this.chartType.PIE;
    this.onFilterChange();
  }

  // Draw Pie Chart
  protected updatePieChart() {  //Update Pie Chart following the filters
    this.pieData = [];
    this.pieData2 = [];
    this.valueMarks = [];

    let dataToShow = this.dataFromServer;

    let fieldToShow = 'usd';
    if (this.filter.value == 'Sum') fieldToShow = 'sum';
    if (this.filter.value == 'Count') fieldToShow = 'count';

    let sum = 0;
    dataToShow.forEach(element => {
      sum += element[fieldToShow];
    });

    dataToShow.forEach((dataPoint, i) => {
      if (this.filter.showBy == 'Currency') {
        let value = dataPoint.count;
        this.pieData.push({ category: dataPoint.name, value: value, color: COLORS[i % 6] });
        this.pieData2.push({ category: dataPoint.name, value: value, color: COLORS[i % 6] });
        let temp = {
          "label": dataPoint.name,
          "value": value,
          "color": COLORS[i % 6]
        }
        this.valueMarks.push(temp);
      } else {
        let value = Math.round(dataPoint[fieldToShow] * 100) / 100
        this.pieData.push({ category: dataPoint.name, value: value, color: COLORS[i % 6] });
        if (value / sum > 0.02)
          this.pieData2.push({ category: dataPoint.name, value: value, color: COLORS[i % 6] });
        
        let temp = {
          "label": dataPoint.name,
          "value": value,
          "color": COLORS[i % 6]
        }
        this.valueMarks.push(temp);
      }
    });

    if (this.pieData.length == 0) {
      this.pieData = [1];
    }
    if (this.pieData2.length == 0) {
      this.pieData2 = [1];
    }
  }

  protected onFilterChange() {
    this.valueList = ['Sum', 'Count'];
    if (this.filter.showBy == 'Currency') {
      this.filter.value = 'Count';
      this.valueList = ['Count'];
    }
    this.dashboardService.calculate(this.filter).subscribe(res => {
      this.dataFromServer = res.data;
      this.updatePieChart();
    })
  }

  protected labelContent(e: any): string {
    return e.category;
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.type && Object.keys(changes).length == 1) return;
    this.onFilterChange();
  }
}
