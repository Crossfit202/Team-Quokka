import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Users } from 'src/users/users';
import { AuthValues } from './config'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from 'src/users/users.service';
import { hash, compare } from 'bcrypt'
import { LoginDto } from 'src/users/dto/login-user.dto';


@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService, // Remove the forwardRef here
        @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService
    ) { }    

      /*
   * takes a password and returns the hashed version of that password for safe storage
   * */
    async hashPassword(password: string): Promise<string> {
        //crypto-fy that password!
        return await hash(password + AuthValues.PEPPER, 10)
    }
    /*
   * takes a username and password and determines if the credentials are valid
   * then returns an access token if valid
   * */
    async validateLogin({ username, password}: LoginDto
    ): Promise<{ access_token: string }> {
        let userToAuth: Users = await this.usersService.findOneByUserName(username)

        let peppered_password: string = password + AuthValues.PEPPER
        let authentication: boolean = await compare(
        peppered_password,
        userToAuth.password,
        )

        if (!authentication) throw new UnauthorizedException()

        const payload = { sub: userToAuth.user_id, username: userToAuth.username }

        let access_token = {
        access_token: await this.jwtService.signAsync(payload, {
            secret: process.env.JWTSECRET,
        }),
        }

        return access_token
    }
}

