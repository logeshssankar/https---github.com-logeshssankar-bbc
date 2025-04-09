import { Component } from '@angular/core';
import { EsidebarComponentComponent } from "../esidebar-component/esidebar-component.component";
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { validateHeaderName } from 'http';
import { __values } from 'tslib';

@Component({
  selector: 'app-billing',
  imports: [EsidebarComponentComponent,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.css'
})
export class BillingComponent {

  userId: string | null = '';
  userName: string | null = '';

  isFormOpen = false;
  billForm: FormGroup;
  billDetails: any = null;

  constructor(private authService: AuthService,private http: HttpClient, private fb: FormBuilder,
    private toastr: ToastrService
   ) {

    this.billForm = this.fb.group({
      customerId: [''],
      customerName: [''],
      unitConsumed: [''],
      billAmount: [''],
      billingStart: [''],
      billingEnd: [''],
      billDueDate: [''],
    });

    this.billForm.get('unitConsumed')?.valueChanges.subscribe(() => {
      this.calculateBillAmount();
    });
    
    this.billForm.get('billingStart')?.valueChanges.subscribe(() => {
      this.setBillingEnd();
      this.setDueDate();
    });
    
  }

  openForm() {
    this.isFormOpen = true;
  }

  closeForm() {
    this.isFormOpen = false;
    this.billDetails = null;
  }

  fetchCustomerDetails() {
    const customerId = this.billForm.get('customerId')?.value; 
  
    if (!customerId) {
      alert('Please enter a Customer ID.');
      return;
    }
  
    this.http.get<any>(`http://localhost:9090/customer/${customerId}`).subscribe(
      (customer) => {
        if (customer) {
          this.billForm.patchValue({
            customerName: customer.name,
          });
        } else {
          alert('Customer not found!');
        }
      },
      (error) => {
        alert('Customer not found or server error!');
      }
    );
  }

  calculateBillAmount() {
    const unitConsumed = parseFloat(this.billForm.get('unitConsumed')?.value);
    if (!isNaN(unitConsumed)) {
      const billAmount = (unitConsumed * 41.50).toFixed(2);
      this.billForm.patchValue({ billAmount });
    }
  }

  setDueDate() {
    const endDate = this.billForm.get('billingStart')?.value;
    if (endDate) {
      const end = new Date(endDate);
      end.setDate(end.getDate() + 10);
      const dueDate = end.toISOString().split('T')[0]; 
      this.billForm.patchValue({ billDueDate: dueDate });
    }
  }

  setBillingEnd() {
    const startDate = this.billForm.get('billingStart')?.value;
    if (startDate) {
      const start = new Date(startDate);
      start.setDate(start.getDate() + 30);
      const endDate = start.toISOString().split('T')[0];
      this.billForm.patchValue({ billingEnd: endDate });
    }
  }
  

  generateBill() {
    if (!this.billForm.valid) {
      this.toastr.warning("Please complete all required fields.");
      return;
    }
  
    const payload = {
      customerId: this.billForm.value.customerId,
      unitConsumed: this.billForm.value.unitConsumed,
      billingStart: this.billForm.value.billingStart
    };
  
    this.http.post<any>('http://localhost:9090/bills/generate', payload).subscribe(
      (response) => {
        this.billDetails = response;

        const billingEnd = this.formatDate(response.billingEnd);
        const billDueDate = this.formatDate(response.billDueDate);
  
        this.billForm.patchValue({
          customerName: response.customer.name,
          billAmount: response.billAmount,
          billingEnd: billingEnd,
          billDueDate: billDueDate
        });
  
        this.toastr.success('Bill Generated Successfully!');
        console.log("Bill generated: ", response);

        this.closeForm;

      },
      (error) => {
        const msg = error?.error?.message || "Error generating bill";
        this.toastr.error(msg);
      }
    );
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }
  
  ngOnInit() {
    this.loadUserDetails();

  }

  loadUserDetails() {
    this.userId = this.authService.getUserId();
    this.userName = this.authService.getUserName();
  }

  logout() {
    this.authService.logout(); 
    window.location.href = '/login'; 
  }

}

