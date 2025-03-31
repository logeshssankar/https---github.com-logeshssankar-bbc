import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService  {
  private apiUrl = 'http://localhost:9090/customer/all';  // Update this URL

  constructor(private http: HttpClient) {}

  getLatestCustomers(count: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?limit=${count}`);
  }
}
