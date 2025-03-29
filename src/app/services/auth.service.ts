import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:9090/user';

  constructor(private http: HttpClient) {}

  verifyUser(employeeId: string, employeeMail: string): Observable<any> {
    const url = `${this.baseUrl}/verify?employeeId=${employeeId}&employeeMail=${employeeMail}`;
    return this.http.post<any>(url, {}, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }).pipe(
      tap(response => {
        console.log("Full API Response:", response); // Debugging
  
        if (response && response.empObj) {
          console.log("Extracted empObj:", response.empObj); // Debugging
  
          localStorage.setItem('userId', response.empObj.employeeId.toString());
          localStorage.setItem('userName', response.empObj.employeeName);
  
          console.log('User Verified:');
          console.log('User ID:', response.empObj.employeeId);
          console.log('User Name:', response.empObj.employeeName);
        } else {
          console.error("empObj is missing in response!");
        }
      })
    );
  }
  

  validateOtp(employeeId: string, otp: string): Observable<any> {
    const url = `${this.baseUrl}/validate-otp?employeeId=${employeeId}&otp=${otp}`;
    return this.http.post<any>(url, {}, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  getUserName(): string | null {
    return localStorage.getItem('userName');
  }

  logout(): void {
    console.log('User Logged Out');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
  }
}
