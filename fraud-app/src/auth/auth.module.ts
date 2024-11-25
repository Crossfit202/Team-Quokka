import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Users } from 'src/users/users'; // Import the Users entity 

@Module({
    imports: [TypeOrmModule.forFeature([Users])], // Provide the Users entity to AuthModule
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule { }
