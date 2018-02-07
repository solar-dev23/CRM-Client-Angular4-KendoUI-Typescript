import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'report-chart-legend',
  templateUrl: './chart-legend.component.html',
  styleUrls: ['./chart-legend.component.scss']
})
export class ReportChartLegendComponent implements OnInit {

  @Input() data: any[] = [];
  @Input() title: any[] = [];

  // colors = ["#ff6358", "#ffd246", "#78d237", "#28b4c8", "#2d73f5", "#aa46be"];
  limit: number = 12;

  constructor() { }

  ngOnInit() {
  }

  // getBackgroundColor(index) {
  //   return this.colors[index % 6];
  // }
}
