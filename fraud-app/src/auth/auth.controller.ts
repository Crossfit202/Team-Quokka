import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() credentials: { username: string; password: string }) {
        return await this.authService.validateUser(credentials.username, credentials.password);
    }
}
