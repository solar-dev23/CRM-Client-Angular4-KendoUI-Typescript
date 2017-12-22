import { HttpService } from '../../../services/http.service';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ValueAxisLabels } from '@progress/kendo-angular-charts';

@Component({
  selector: 'report-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})

export class ReportChartComponent implements OnInit {
  Type = {
    PIE: 'pie',
    DONUT: 'donut',
    BAR_VERTICAL: 'bar-vert',
    BAR_HORIZONTAL: 'bar-horz',
    LINE: 'line',
    FUNNEL: 'funnel'
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
    if (this.type == undefined) this.type = this.Type.PIE;
    this.onFilterChange();
  }

  pieData2: any = [1];
  // Draw Pie Chart
  updatePieChart() {  //Update Pie Chart following the filters
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

    dataToShow.forEach(dataPoint => {
      if (this.filter.showBy == 'Currency') {
        let value = dataPoint.count;
        this.pieData.push({ category: dataPoint.name, value: value });
        this.pieData2.push({ category: dataPoint.name, value: value });
        let temp = {
          "label": dataPoint.name,
          "value": value
        }
        this.valueMarks.push(temp);
      } else {
        let value = Math.round(dataPoint[fieldToShow] * 100) / 100
        this.pieData.push({ category: dataPoint.name, value: value });
        if (value / sum > 0.02)
          this.pieData2.push({ category: dataPoint.name, value: value });
        let temp = {
          "label": dataPoint.name,
          "value": value
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

  getBackgroundColor(index) {
    return this.colors[index % 6];
  }
  onFilterChange() {
    this.valueList = ['Sum', 'Count'];
    if (this.filter.showBy == 'Currency') {
      this.filter.value = 'Count';
      this.valueList = ['Count'];
    }
    this.isLoading = true;
    this.httpService.calculate(this.filter).subscribe(res => {
      this.isLoading = false;
      this.dataFromServer = res.data;
      this.updatePieChart();
    })
  }
  public labelContent(e: any): string {
    return e.category;
  }


  ngOnChanges(changes: SimpleChanges) {
    if(changes.type && Object.keys(changes).length == 1) return;
    this.onFilterChange();
  }
}
