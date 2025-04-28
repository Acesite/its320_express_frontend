import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { AboutComponent } from './components/about/about.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { FooterComponent } from './components/footer/footer.component';
import { DisplayQuotesComponent } from './displayquotes/displayquotes.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // <-- Import CommonModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent, 
    AboutComponent, 
    ProjectsComponent, 
    ContactsComponent, 
    FooterComponent, 
    DisplayQuotesComponent, 
    TodoListComponent, 
    RouterOutlet, 
    NavbarComponent,
    CommonModule // <-- Add CommonModule here
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'My Portfolio';
  showNavbar = true; // Default: show the navbar

  constructor(private router: Router) {}

  ngOnInit() {
    // Listen for route changes to determine whether to show the navbar
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Show navbar only for the 'todo-list' route
        if (this.router.url === '/login' || this.router.url === '/register') {
          this.showNavbar = false; // Hide navbar on login and register
        } else if (this.router.url === '/todo-list') {
          this.showNavbar = true; // Show navbar on todo-list page
        } else {
          this.showNavbar = true; // Default behavior: Show navbar
        }
      }
    });
  }
}
