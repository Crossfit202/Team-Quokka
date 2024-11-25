import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-screen',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-screen.component.html',
  styleUrl: './login-screen.component.css'
})
export class LoginScreenComponent {
  username: string = '';
  password: string = '';

  login() {
    console.log('Login clicked!');
    console.log('Username:', this.username);
    console.log('Password:', this.password);

    // Add authentication logic
  }
}
