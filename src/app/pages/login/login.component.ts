import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { FormsModule } from '@angular/forms'; // <-- Add this

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true, // <-- You're using standalone
  imports: [FormsModule], // <-- Add FormsModule here
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private accountService: AccountService, private router: Router) {}

  onLogin() {
    this.accountService.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        console.log(res); // Log the response to confirm the structure
        if (res && res.userId) {
          localStorage.setItem('userId', res.userId); 
          localStorage.setItem('username', res.username); 
           this.router.navigate(['/todo-list']);
        } else {
          alert('Invalid response from server. UserId is missing');
        }
      },
      error: (err) => {
        alert(err.error.message || 'Login failed');
      }
    });
  }
  
  
}
