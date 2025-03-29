import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
// import { provideHttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-e-login-component',
  standalone: true,
  imports: [CommonModule, ToastrModule, FormsModule],
  templateUrl: './e-login-component.component.html',
  styleUrl: './e-login-component.component.css'
})
export class ELoginComponentComponent {
  step = 1;
  employeeId: string = '';
  employeeMail: string = '';
  otp: string = '';

  constructor(private authService: AuthService, private toastr: ToastrService,private router: Router) {}

  ngOnInit() {
    // this.toastr.info('Toastr is working!', 'Debug');
  }
  

  verifyUser() {
    this.authService.verifyUser(this.employeeId, this.employeeMail).subscribe(
      response => {
        console.log("API Response:", response); // Debugging
  
        if (response.message === "OTP Sent Successfully") {
          this.otp = response.otp; // Auto-fill the OTP field
          console.log("Generated OTP:", this.otp); // Debugging to check OTP storage
          this.toastr.success(`OTP Sent Successfully! Your OTP is: ${response.otp}`, 'Success');
          this.step = 2; // Move to OTP step
        } else {
          this.toastr.error('Invalid Employee ID or Email!', 'Error');
        }
      },
      error => {
        console.error("API Error:", error);
        this.toastr.error('Error connecting to the server!');
      }
    );
  }
  
  

  loginWithOTP() {
    this.authService.validateOtp(this.employeeId, this.otp).subscribe(
      (response) => {
        console.log("Response from API:", response); // Debugging line
        try {
          const res = typeof response === 'string' ? JSON.parse(response) : response;
  
          if (res.message === "Login Successful") {
            this.toastr.success('Login Successful!', 'Welcome');
            this.router.navigate(['/userdashboard']);
          } else {
            this.toastr.error('Invalid OTP!', 'Try Again');
          }
        } catch (error) {
          console.error("Error parsing response:", error);
          this.toastr.error('Unexpected response format!', 'Error');
        }
      },
      (error) => {
        console.error("API Error:", error);
        this.toastr.error('Error connecting to the server!', 'Error');
      }
    );
  }
}  