import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EsidebarComponentComponent } from "../esidebar-component/esidebar-component.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-customer-mng',
  standalone:true,
  imports: [CommonModule, FormsModule, EsidebarComponentComponent],
  templateUrl: './customer-mng.component.html',
  styleUrl: './customer-mng.component.css'
})

export class CustomerMngComponent{


  searchQuery: string = '';
  customers: any[] = [];
  selectedCustomer: any = null;  

  addCustomer() {
    this.selectedCustomer = {
      name: '',
      email: '',
      phone_number: '',
      location: '',
      unit_consumed: 0,
      bill_amount: 0,
      bill_due_date: '',
      payment_status: 'Unpaid'
    };
  }
  


  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchCustomers();
  }

  fetchCustomers() {
    this.http.get<any[]>('http://localhost:9090/customer/all') 
      .subscribe(
        data => {
          this.customers = data;
        },
        error => {
          console.error('Error fetching customers:', error);
        }
      );
  }



  deleteCustomer(customerId: number) {
    if (confirm('Are you sure you want to delete this customer?')) {
      // Immediately remove the customer from UI
      this.customers = this.customers.filter(c => c.customer_id !== customerId);
  
      this.http.delete(`http://localhost:9090/customer/delete/${customerId}`)
        .subscribe({
          next: () => console.log('Customer deleted successfully!'),
          error: (err) => {
            console.error('Error deleting customer:', err);
            // Optionally re-fetch customers in case of failure
            this.fetchCustomers();
          }
        });
    }
  }
  
 // ✅ Open update form with selected customer details
selectCustomerForUpdate(customer: any) {
  this.selectedCustomer = { ...customer }; // Clone object to avoid direct mutation
}

// ✅ Submit updated data to the backend and close modal
updateCustomer() {
  if (!this.selectedCustomer) return;

  this.http.put(`http://localhost:9090/customer/update/${this.selectedCustomer.customer_id}`, this.selectedCustomer)
    .subscribe({
      next: () => {
        alert('Customer updated successfully!');
        
        
        const index = this.customers.findIndex(c => c.customer_id === this.selectedCustomer.customer_id);
        if (index !== -1) {
          this.customers[index] = { ...this.selectedCustomer };
        }

        this.selectedCustomer = null;
      },
      error: err => console.error('Error updating customer:', err)
    });
}

closeUpdateForm() {
  this.selectedCustomer = null;
}


saveCustomer() {
  if (!this.selectedCustomer) return;

  if (this.selectedCustomer.customer_id) {
    
    this.updateCustomer();
  } else {
  
    this.http.post('http://localhost:9090/customer/add', this.selectedCustomer)
      .subscribe({
        next: () => {
          alert('Customer added successfully!');
          this.fetchCustomers(); 
          this.selectedCustomer = null;
        },
        error: err => console.error('Error adding customer:', err)
      });
  }
}


uploadFile(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  this.http.post('http://localhost:9090/customer/upload', formData)
    .subscribe({
      next: () => alert('File uploaded successfully!'),
      error: err => console.error('Error uploading file:', err)
    });
}


 
}





