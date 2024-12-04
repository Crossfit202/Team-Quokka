import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserStateService } from '../services/user-state.service'; // Import UserStateService
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-login-screen',
  standalone: true,
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css'],
  imports: [FormsModule, HeaderComponent],
})
export class LoginScreenComponent {
  username: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private userStateService: UserStateService, // Inject UserStateService
    private router: Router
  ) { }

  login() {
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (response) => {
        console.log('Login successful:', response);

        // Save user data locally
        this.userStateService.setUser({
          user_id: response.user_id, // Assuming the backend sends user_id
          username: response.username,
          role: response.role,
        });

        // Navigate based on user role
        if (response.role === 'admin') {
          this.router.navigate(['/admin-home']);
        } else if (response.role === 'admin2') {
          this.router.navigate(['/advanced-user']);
        } else {
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
