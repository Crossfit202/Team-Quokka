import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/users';
import { Repository } from 'typeorm';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,
    ) { }

    // Fetch the user from the database using the provided username and password
    async validateUser(username: string, password: string): Promise<{ user_id: number; username: string; role: string }> {
        const user = await this.usersRepository.findOne({ where: { username, password } });

        // If no user is found, throw an UnauthorizedException
        if (!user) {
            throw new UnauthorizedException('Invalid username or password');
        }

        // Return ID, username, and role
        return { user_id: user.user_id, username: user.username, role: user.role };
    }

}

