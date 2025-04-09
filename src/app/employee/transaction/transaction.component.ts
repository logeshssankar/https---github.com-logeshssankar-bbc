import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EsidebarComponentComponent } from "../esidebar-component/esidebar-component.component";
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { FilterByCustomerIdPipe } from '../../filter-by-customer-id.pipe';

export interface Transaction {
  transactionId: number;
  bill: {
    billId: number;
  };
  customer: {
    customer_id: number;
  };
  amountPaid: number;
  transactionStatus: string;
  transactionDate: string;
  paymentMode: string;
  }

@Component({
  selector: 'app-transaction',
  imports: [EsidebarComponentComponent,CommonModule, FormsModule, FilterByCustomerIdPipe],
  standalone:true,
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
logout() {
  this.authService.logout(); 
  window.location.href = '/login'; 
}
  transactions: Transaction[] = [];

  userId: string | null = '';
  userName: string | null = '';
searchText: string = '';


  constructor(private transactionService: TransactionService,private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchTransactions();
    this.loadUserDetails();
  }
  loadUserDetails() {
    this.userId = this.authService.getUserId();
    this.userName = this.authService.getUserName();
  }

  fetchTransactions(): void {
    this.transactionService.getAllTransactions().subscribe(
      (data) => {
        console.log('Transactions:', data);
        this.transactions = data.sort((a, b) => b.transactionId - a.transactionId);;
      },
      (error) => {
        console.error('Error fetching transactions:', error);
      }
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:9090/Transaction';
  authService: any;

  constructor(private http: HttpClient) {}

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions`);
  }

  getTransactionsByBillId(billId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/bill/${billId}`);
  }

}

