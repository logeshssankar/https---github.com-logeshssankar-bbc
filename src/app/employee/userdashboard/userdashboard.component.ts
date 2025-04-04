import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { EsidebarComponentComponent } from "../esidebar-component/esidebar-component.component";
import { AuthService } from '../../services/auth.service';
import { CustomerService } from '../../services/customer.service'
 
@Component({
  selector: 'app-userdashboard',
  standalone: true,
  imports: [CommonModule, EsidebarComponentComponent],
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css']
})
export class UserdashboardComponent implements AfterViewInit, OnInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChartCanvas') pieChartCanvas!: ElementRef<HTMLCanvasElement>;

  pieChart: Chart | null = null;
  chart: Chart | null = null;  

  userId: string | null = '';
  userName: string | null = '';

  
  latestCustomers: any[] = [];  


  constructor(private authService: AuthService, private customerService: CustomerService ) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.loadUserDetails();
    this.createChart();
    this.createPieChart();
    this.loadLatestCustomers();
  }

  loadUserDetails() {
    this.userId = this.authService.getUserId();
    this.userName = this.authService.getUserName();
  }

  ngAfterViewInit(): void {
  setTimeout(() => {
    this.createChart();
    this.createPieChart();
  }, 100); // Increase delay to 100ms or more
}


  createChart() {
    if (!this.chartCanvas || !this.chartCanvas.nativeElement) {
      console.error("Chart canvas not found!");
      return;
    }

    const ctx = this.chartCanvas.nativeElement.getContext("2d");

    if (!ctx) {
      console.error("Canvas rendering context not available!");
      return;
    }

    // 🔥 Destroy the previous chart before creating a new one
    if (this.chart) {
      this.chart.destroy();
    }

    // 🎯 Create a new Chart
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Income',
            data: [45000, 55000, 62000, 70000, 67000, 74000],
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 0, 255, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          },
          {
            label: 'Expense',
            data: [30000, 32000, 29000, 34000, 33000, 37000],
            borderColor: 'red',
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

    console.log("Chart Created Successfully!");
  }


createPieChart() {
  if (!this.pieChartCanvas || !this.pieChartCanvas.nativeElement) {
    console.error("Pie Chart canvas not found!");
    return;
  }

  const ctx = this.pieChartCanvas.nativeElement.getContext("2d");

  if (!ctx) {
    console.error("Canvas rendering context not available!");
    return;
  }

  // Destroy existing chart instance if present
  if (this.pieChart) {
    this.pieChart.destroy();
  }

  // 🎯 Revenue data for 4 years
  const revenueData = [50000, 75000, 62000, 90000]; // Example revenue data
  const years = ["2021", "2022", "2023", "2024"];

  this.pieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: years,  // Year Labels
      datasets: [
        {
          data: revenueData,  // Revenue Amounts
          backgroundColor: ["#3cba9f", "#ffcc00", "#ff4444", "#4285F4"], // Custom Colors
          hoverOffset: 8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { size: 14 },
            color: "#333"
          }
        },
        title: {
          display: true,
          text: "Company Revenue (Last 4 Years)",
          font: { size: 16 }
        }
      }
    }
  });

  console.log("Pie Chart Created Successfully!");
}


loadLatestCustomers() {
  this.customerService.getLatestCustomers(5).subscribe({
    next: (data: any[]) => {
      this.latestCustomers = data;
    },
    error: (err: any) => console.error("Error fetching latest customers:", err)
  });
}
}
