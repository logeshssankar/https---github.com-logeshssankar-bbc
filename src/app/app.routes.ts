import { Routes } from '@angular/router';
// import { ELoginComponentComponent } from './employee/e-login-component/e-login-component.component';
import { EsidebarComponentComponent } from './employee/esidebar-component/esidebar-component.component';
import { UserdashboardComponent } from './employee/userdashboard/userdashboard.component';
import { ELoginComponentComponent } from './employee/e-login-component/e-login-component.component';
import { CustomerMngComponent } from './employee/customer-mng/customer-mng.component';

export const routes: Routes = [

    { path:'login',component:ELoginComponentComponent},
    { path:'enav',component:EsidebarComponentComponent},
    { path:'userdashboard',component:UserdashboardComponent},
    { path:'customers',component:CustomerMngComponent}   
];


