import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-screen',
  standalone: true,
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css'],
  imports: [FormsModule],
})
export class LoginScreenComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (response) => {
        console.log('Login successful:', response);

        // Navigate based on user role
        if (response.role === 'admin') {
          console.log('Navigating to Admin Home');
          this.router.navigate(['/admin-home']);
        } else if (response.role === 'admin2') {
          console.log('Navigating to Advanced User Dashboard');
          this.router.navigate(['/advanced-user']);
        } else {
          console.error('Unknown role:', response.role);
          alert('Invalid role detected!');
        }
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert('Invalid username or password!');
      },
    });
  }
  
}
