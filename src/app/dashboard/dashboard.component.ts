import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public chartResidence: any;
  public chartProducts: any;

  ngOnInit(): void {
    this.createChartResidence();
    this.createChartProducts();
  }

  createChartResidence() {
    this.chartResidence = new Chart('MyChartResidence', {
      type: 'bar', // Typ des horizontalen Balkendiagramms

      data: {
        labels: ['Berlin', 'Hannover', 'Zürich'],
        datasets: [
          {
            label: 'User',
            data: [65, 59, 34],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
          },
        },
        aspectRatio: 4, // Ändern Sie diesen Wert, um die Höhe anzupassen
      },
    });
  }

  createChartProducts() {
    this.chartProducts = new Chart('MyChartProducts', {
      type: 'doughnut', // Typ des horizontalen Balkendiagramms

      data: {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [
          {
            label: 'My First Dataset',
            data: [300, 50, 100],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
            ],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        aspectRatio: 4, // Ändern Sie diesen Wert, um die Höhe anzupassen
      },
    });
  }
}
