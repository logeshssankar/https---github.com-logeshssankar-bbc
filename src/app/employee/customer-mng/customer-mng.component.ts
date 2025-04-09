import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EsidebarComponentComponent } from "../esidebar-component/esidebar-component.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-customer-mng',
  standalone:true,
  imports: [CommonModule, FormsModule, EsidebarComponentComponent],
  templateUrl: './customer-mng.component.html',
  styleUrl: './customer-mng.component.css'
})

export class CustomerMngComponent implements OnInit{

  userId: string | null = '';
  userName: string | null = '';

  searchQuery: string = '';
  customers: any[] = [];
  selectedCustomer: any = null;  

  selectedCustomerForCard: any = null;

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
  


  constructor(private http: HttpClient,private authService: AuthService) {}

  ngOnInit() {
    this.fetchCustomers();
    this.loadUserDetails();
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
      this.customers = this.customers.filter(c => c.customer_id !== customerId);
  
      this.http.delete(`http://localhost:9090/customer/delete/${customerId}`)
        .subscribe({
          next: () => console.log('Customer deleted successfully!'),
          error: (err) => {
            console.error('Error deleting customer:', err);
            this.fetchCustomers();
          }
        });
    }
  }
  

selectCustomerForUpdate(customer: any) {
  this.selectedCustomer = { ...customer }; 
}

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
      next: (res:any) => alert('File uploaded successfully!'),
      error: err => console.error('Error uploading file:', err)
    });
}
editCustomer(customer: any) {
  this.selectedCustomer = { ...customer };
  
}
selectCustomerUpdate(customer: any) {
  this.selectedCustomerForCard = { ...customer };

  setTimeout(() => {
    const profileEl = document.querySelector('.profile-card');
    if (profileEl) {
      profileEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, 100);
}


get filteredCustomers() {
  const query = this.searchQuery.toLowerCase();
  return this.customers.filter(customer =>
    customer.name.toLowerCase().includes(query) ||
    customer.customer_id.toString().includes(query)
  );
}

loadUserDetails() {
  this.userId = this.authService.getUserId();
  this.userName = this.authService.getUserName();
}

logout() {
  this.authService.logout(); 
  window.location.href = '/login'; 
}

currentPage: number = 1;
itemsPerPage: number = 10;

get totalPages(): number {
  return Math.ceil(this.filteredCustomers.length / this.itemsPerPage);
}

get paginatedCustomers(): any[] {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  return this.filteredCustomers.slice(startIndex, startIndex + this.itemsPerPage);
}

goToPage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
  }
}

prevPage() {
  if (this.currentPage > 1) this.currentPage--;
}

nextPage() {
  if (this.currentPage < this.totalPages) this.currentPage++;
}

}





