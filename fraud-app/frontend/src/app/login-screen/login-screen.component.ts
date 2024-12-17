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
    this.userStateService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        // Navigate based on user role
        setTimeout(() => {
          this.userStateService.getUser().subscribe(data => {
            if (data.role === 'admin') {
              this.router.navigate(['/admin-home']);
            } else if (data.role === 'admin2') {
              this.router.navigate(['/advanced-user']);
            } else {
              alert('Invalid role detected!');
            }
          })
        })

      },
      error: (err) => {
        console.error('Login failed:', err);
        alert('Invalid username or password!');
      },
    });
  }
}
