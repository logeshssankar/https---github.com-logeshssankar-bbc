import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EsidebarComponentComponent } from "../esidebar-component/esidebar-component.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { ToastrService } from 'ngx-toastr';
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
  


  constructor(private http: HttpClient,private toastr: ToastrService,private authService: AuthService) {}

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


// uploadFile(event: any) {
//   const file = event.target.files[0];
//   if (!file) return;

//   const formData = new FormData();
//   formData.append("file", file);

//   this.http.post('http://localhost:9090/customer/upload', formData)
//     .subscribe({
//       next: (res:any) => alert('File uploaded successfully!'),
//       error: err => console.error('Error uploading file:', err)
//     });
// }
uploadFile(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  this.http.post('http://localhost:9090/customer/upload', formData).subscribe({
    next: (res: any) => {
      const correctCount = res.correctCount || 0;
      const rejectCount = res.rejectCount || 0;
      const rejectedRecords = res.rejectedRecords || [];

      if (res.success && rejectCount === 0) {
       
        this.toastr.success('All records uploaded successfully!', 'Success');
        this.fetchCustomers(); 
      } else if (!res.success && rejectCount > 0) {
     
        this.toastr.error('All records rejected!', 'Upload Failed');
        this.generatePDF(rejectedRecords);
      } else if (res.success && rejectCount > 0) {
        
        this.toastr.warning(`${correctCount} records uploaded, ${rejectCount} rejected.`, 'Partial Success');
        this.generatePDF(rejectedRecords);
        this.fetchCustomers(); 
      }
    },
    error: err => {
      console.error('Error uploading file:', err);
      this.toastr.error('File upload failed. Try again.', 'Error');
    }
  });
}

generatePDF(data: any[]) {
  const doc = new jsPDF();

  const headers = Object.keys(data[0] || {}).map(key => key.toUpperCase());
  const body = data.map(row =>
    headers.map(h => String(row[h.toLowerCase()] ?? ""))
  );

  autoTable(doc, {
    head: [headers],
    body: body,
    startY: 20,
    margin: { top: 20, left: 10, right: 10 },
    styles: {
      fontSize: 6.5,
      cellPadding: 1.5,
      overflow: 'linebreak',
      valign: 'middle',
      halign: 'center', 
    },
    headStyles: {
      fillColor: [0, 102, 204],  
      textColor: [255, 255, 255], 
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: {
      textColor: [0, 0, 0],
    },
    didDrawPage: function (data) {
      doc.setFontSize(8);
      doc.text("Rejected Records Report", 10, 10);
    },
  });

  doc.save('Rejected_Records_Styled.pdf');
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





