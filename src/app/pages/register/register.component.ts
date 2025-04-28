import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { FormsModule } from '@angular/forms'; // <-- Add this

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true, // <-- Standalone component
  imports: [FormsModule], // <-- Add FormsModule here
})
export class RegisterComponent {
  username = '';
  password = '';

  constructor(private accountService: AccountService, private router: Router) {}

  onRegister() {
    this.accountService.register({ username: this.username, password: this.password }).subscribe({
      next: () => {
        alert('Account created! You can now log in.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert(err.error.message || 'Registration failed');
      }
    });
  }
}
