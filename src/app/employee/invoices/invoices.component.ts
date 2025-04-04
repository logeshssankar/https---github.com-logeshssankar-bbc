import { Component, OnInit } from '@angular/core';
import { EsidebarComponentComponent } from "../esidebar-component/esidebar-component.component";
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoices',
  imports: [EsidebarComponentComponent,CommonModule],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css'
})
export class InvoicesComponent  implements OnInit {
payNow(arg0: any) {
throw new Error('Method not implemented.');
}

  invoices: any[] = [];
  searchText: string = '';


  userId: string | null = '';
  userName: string | null = '';

   constructor(private authService: AuthService , private http: HttpClient) {

    }

    
  ngOnInit() {
    this.loadUserDetails();
    this.fetchInvoices();



  }

  loadUserDetails() {
    this.userId = this.authService.getUserId();
    this.userName = this.authService.getUserName();
  }

  fetchInvoices() {
    this.http.get<any[]>('http://localhost:9090/bills/invoices').subscribe(
      (data) => {
        this.invoices = data;
      },
      (error) => {
        console.error('Error fetching invoices', error);
      }
    );
  }

  filteredInvoices(): any[] {
    return this.invoices.filter(invoice =>
      invoice.customerName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  removeInvoice(billId: number): void {
    if (confirm('Are you sure you want to remove this invoice?')) {
      this.http.delete(`http://localhost:9090/bills/${billId}`).subscribe(() => {
        this.invoices = this.invoices.filter(invoice => invoice.billId !== billId);
        this.invoices = [...this.invoices];
      });
    }
  }
}
