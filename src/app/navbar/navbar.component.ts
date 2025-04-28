import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  username: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Retrieve the username from localStorage
    this.username = localStorage.getItem('username');
  }

  // Logout function
  logout(): void {
    // Remove user-related data from localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    // Redirect to login page or home page
    this.router.navigate(['/login']); // Adjust the path according to your routing configuration
  }
}
