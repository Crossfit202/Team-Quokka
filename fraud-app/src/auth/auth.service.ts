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

    async validateUser(username: string, password: string): Promise<{ role: string } | null> {
        const user = await this.usersRepository.findOne({ where: { username, password } });
        if (!user) {
            throw new UnauthorizedException('Invalid username or password');
        }
        return { role: user.role }; // Return user role
    }
}

