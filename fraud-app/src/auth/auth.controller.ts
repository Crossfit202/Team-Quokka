import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { timer } from 'rxjs/internal/observable/timer';

@Controller('login-screen') // Base route: /auth
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post() // POST route: /auth/login
    async login(@Body() loginData: { username: string; password: string }) {
        const user = await this.authService.validateUser(loginData.username, loginData.password);

        console.log(user);
        return user; // Return the authenticated user
    }
}
