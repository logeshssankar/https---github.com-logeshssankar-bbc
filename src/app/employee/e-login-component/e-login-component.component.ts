import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
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
  otpDigits: string[] = ['', '', '', '', '', '']; // Array to store OTP digits

  constructor(private authService: AuthService, private toastr: ToastrService, private router: Router) {}

  verifyUser() {
    this.authService.verifyUser(this.employeeId, this.employeeMail).subscribe(
      response => {
        if (response.message === "OTP Sent Successfully") {
          this.otp = response.otp; // Assuming OTP is returned from API
          this.toastr.success(`OTP Sent: ${this.otp}`, 'Success'); // Display OTP in Toastr (For Testing)

          // Auto-fill OTP input fields
          this.otpDigits = this.otp.split('');

          this.step = 2; // Move to OTP input step
        } else {
          this.toastr.error('Invalid Employee ID or Email!', 'Error');
        }
      },
      error => {
        this.toastr.error('Error connecting to the server!', 'Error');
      }
    );
  }

  handleOtpInput(event: any, index: number) {
    const input = event.target;
    const value = input.value;

    // Move to next field if a digit is entered
    if (value.length === 1 && index < 5) {
      input.nextElementSibling?.focus();
    }

    // Handle backspace: Move to previous field
    if (value.length === 0 && index > 0) {
      input.previousElementSibling?.focus();
    }

    this.otpDigits[index] = value;
    this.otp = this.otpDigits.join('');
  }

  loginWithOTP() {
    this.authService.validateOtp(this.employeeId, this.otp).subscribe(
      response => {
        if (response.message === "Login Successful") {
          this.toastr.success('Login Successful!', 'Welcome');
          this.router.navigate(['/userdashboard']);
        } else {
          this.toastr.error('Invalid OTP!', 'Try Again');
        }
      },
      error => {
        this.toastr.error('Error connecting to the server!', 'Error');
      }
    );
  }
}
