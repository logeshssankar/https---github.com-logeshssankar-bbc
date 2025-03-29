import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { EsidebarComponentComponent } from "../esidebar-component/esidebar-component.component";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-userdashboard',
  standalone: true,
  imports: [CommonModule, EsidebarComponentComponent],
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css']
})
export class UserdashboardComponent implements AfterViewInit, OnInit {
  userId: string | null = '';
  userName: string | null = '';

  constructor(private authService: AuthService) {
    Chart.register(...registerables); // ✅ Register Chart.js modules
  }

  ngOnInit() {
    this.loadUserDetails();
  }

  loadUserDetails() {
    this.userId = this.authService.getUserId();
    this.userName = this.authService.getUserName();
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  createChart() {
    const canvas = document.getElementById("myChart") as HTMLCanvasElement;
    if (!canvas) {
      console.error("Chart element not found!");
      return;
    }

    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April'],
        datasets: [{
          label: 'Sales',
          data: [65, 59, 80, 81],
          backgroundColor: ['red', 'blue', 'green', 'orange'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true
      }
    });
  }

  toggleSidebar() {
    console.log("Sidebar Toggled");
  }
}
