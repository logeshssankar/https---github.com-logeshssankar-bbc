import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { routes } from './app/app.routes'; // Import routes
import { HttpClient, provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideRouter(routes),
    importProvidersFrom(ToastrModule.forRoot())
  ]
}).catch(err => console.error(err));
