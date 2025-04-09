import { Component, OnInit } from '@angular/core';
import { EsidebarComponentComponent } from "../esidebar-component/esidebar-component.component";
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoices',
  imports: [EsidebarComponentComponent,CommonModule, FormsModule],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css'
})
export class InvoicesComponent  implements OnInit {

  invoices: any[] = [];
  searchText: string = '';


  userId: string | null = '';
  userName: string | null = '';

  showPaymentForm: boolean = false;
  selectedInvoice: any = null;

  paymentData = {
    billId: 0,
    customerId: 0,
    amountPaid: 0,
    paymentMode: '',
    paymentReference: ''
  };

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
    const lowerSearch = this.searchText.toLowerCase();
    return this.invoices.filter(invoice =>
      invoice.customerName.toLowerCase().includes(lowerSearch) ||
      invoice.customerId.toString().includes(this.searchText)
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
  payNow(billId: number) {
    const invoice = this.invoices.find(inv => inv.billId === billId);
    if (invoice) {
      this.selectedInvoice = invoice;
      this.paymentData = {
        billId: invoice.billId,
        customerId: invoice.customerId,
        amountPaid: invoice.finalAmount,
        paymentMode: '',
        paymentReference: ''
      };
      this.showPaymentForm = true;
    }
  }
  
  cancelPayment() {
    this.showPaymentForm = false;
    this.selectedInvoice = null;
  }
  submitPayment() {
  console.log("Submitting payment", this.paymentData); 
  this.http.post<{ message: string }>('http://localhost:9090/payments/pay', this.paymentData)
    .subscribe({
      next: (res) => {
        alert(res.message); 
        this.showPaymentForm = false;
        this.fetchInvoices(); 
      },
      error: (err) => {
        console.error('Backend error:', err.error);
        const errorMsg = err?.error?.message || 'Payment failed due to an unknown error.';
        alert("Payment failed");
      }
    });
}
  
  calculateDiscount(): number {
    if (!this.selectedInvoice) return 0;
  
    let discount = 0;
    const billAmount = this.selectedInvoice.billAmount;
    const dueDate = new Date(this.selectedInvoice.billDueDate);
    const today = new Date();
  
    if (today < dueDate) {
      discount += billAmount * 0.05;
    }
  
    if (this.paymentData.paymentMode !== 'CASH') {
      discount += billAmount * 0.05;
    }
  
    return Math.round(discount);
  }

  getFinalAmountAfterDiscount(): number {
    if (!this.selectedInvoice) return 0;
  
    const discount = this.calculateDiscount();
    const finalAmount = this.selectedInvoice.billAmount - discount;
  
    this.paymentData.amountPaid = Math.floor(finalAmount); 
    return this.paymentData.amountPaid;
  }

  onPaymentModeChange() {
    const discount = this.calculateDiscount();
    this.getFinalAmountAfterDiscount();
    this.paymentData.amountPaid = this.selectedInvoice.billAmount - discount;
  }
  
  logout() {
    this.authService.logout(); 
    window.location.href = '/login'; 
  }
  
}
