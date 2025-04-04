import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EsidebarComponentComponent } from "../esidebar-component/esidebar-component.component";
import { CommonModule } from '@angular/common';

export interface Transaction {
  transactionId: number;
  billId: number;
  customerId: number;
  amountPaid: number;
  transactionStatus: string;
  paymentMode: string;
  transactionDate: string;
}

@Component({
  selector: 'app-transaction',
  imports: [EsidebarComponentComponent,CommonModule],
  standalone:true,
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  transactions: Transaction[] = [];

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.fetchTransactions();
  }

  fetchTransactions(): void {
    this.transactionService.getAllTransactions().subscribe(
      (data) => {
        this.transactions = data;
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

  constructor(private http: HttpClient) {}

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions`);
  }

  getTransactionsByBillId(billId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/bill/${billId}`);
  }

}

