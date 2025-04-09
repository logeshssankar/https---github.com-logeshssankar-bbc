import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-esidebar-component',
  imports: [CommonModule],
  templateUrl: './esidebar-component.component.html',
  styleUrl: './esidebar-component.component.css'
})
export class EsidebarComponentComponent {

  isOpen = false; 
  
  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
}