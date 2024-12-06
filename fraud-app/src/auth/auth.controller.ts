import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // Define a POST endpoint at 'auth/login' for user login
    @Post('login')
    async login(@Body() credentials: { username: string; password: string }) {
        // Extract the username and password from the request body and validate the user
        return await this.authService.validateUser(credentials.username, credentials.password);
    }
}
