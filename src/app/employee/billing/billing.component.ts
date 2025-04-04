import { Component } from '@angular/core';
import { EsidebarComponentComponent } from "../esidebar-component/esidebar-component.component";
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-billing',
  imports: [EsidebarComponentComponent,CommonModule,FormsModule],
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
  }

  openForm() {
    this.isFormOpen = true;
  }

  closeForm() {
    this.isFormOpen = false;
    this.billDetails = null;
  }

  fetchCustomerDetails() {
    const customerId = this.billForm.get('customerId')?.value; // Use FormGroup correctly
  
    if (!customerId) {
      alert('Please enter a Customer ID.');
      return;
    }
  
    this.http.get<any>(`http://localhost:9090/customer/${customerId}`).subscribe(
      (customer) => {
        if (customer) {
          this.billForm.patchValue({
            customerName: customer.name,
            unitConsumed: customer.unit_consumed,
            billAmount: (customer.unit_consumed * 41.50).toFixed(2),
            // billingStart: customer.billing_start,
            // billingEnd: customer.billing_end,
            billDueDate: customer.bill_due_date,
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
  


  generateBill() {
    const customerId = this.billForm.value.customerId;
  
    this.http.post<any>(`http://localhost:9090/bills/generate/${customerId}`, {}).subscribe(
      (response) => {
        this.billDetails = response;
        this.toastr.success('Bill Generated Successfully!');
      },
      (error) => {
        const errorMessage = error?.error?.message || error?.error || 'Error generating bill!';
        
        if (errorMessage.includes("Bill is already generated")) {
          this.toastr.warning('Bill is already generated for this customer!');
        } else {
          this.toastr.error(errorMessage);
        }
      }
    );
  }
  

  ngOnInit() {
    this.loadUserDetails();

  }

  loadUserDetails() {
    this.userId = this.authService.getUserId();
    this.userName = this.authService.getUserName();
  }

}

