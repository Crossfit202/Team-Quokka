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

    async validateUser(username: string, password: string): Promise<{ user_id: number; username: string; role: string }> {
        const user = await this.usersRepository.findOne({ where: { username, password } });
        if (!user) {
            throw new UnauthorizedException('Invalid username or password');
        }
        return { user_id: user.user_id, username: user.username, role: user.role }; // Ensure full data is returned
    }

}

