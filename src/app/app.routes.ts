import { Routes } from '@angular/router';
// import { ELoginComponentComponent } from './employee/e-login-component/e-login-component.component';
import { EsidebarComponentComponent } from './employee/esidebar-component/esidebar-component.component';
import { UserdashboardComponent } from './employee/userdashboard/userdashboard.component';
import { ELoginComponentComponent } from './employee/e-login-component/e-login-component.component';
import { CustomerMngComponent } from './employee/customer-mng/customer-mng.component';
import { BillingComponent } from './employee/billing/billing.component';
import { InvoicesComponent } from './employee/invoices/invoices.component';
import { TransactionComponent } from './employee/transaction/transaction.component';

export const routes: Routes = [

    { path:'login',component:ELoginComponentComponent},
    { path:'enav',component:EsidebarComponentComponent},
    { path:'userdashboard',component:UserdashboardComponent},
    { path:'customers',component:CustomerMngComponent},
    { path:'billing',component:BillingComponent},
    { path:'invoices',component:InvoicesComponent},
    { path: 'transaction',component:TransactionComponent}
];


