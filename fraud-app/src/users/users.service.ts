import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users';
import { Audit_log } from 'src/audit_log/audit_log';
import { Reports } from 'src/reports/reports';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>,

        @InjectRepository(Audit_log)
        private readonly auditLogRepository: Repository<Audit_log>,

        @InjectRepository(Reports)
        private readonly reportsRepository: Repository<Reports>,
    ) { }

    // CREATE
    async create(data: Partial<Users>): Promise<Users> {
        const newUser = this.userRepository.create(data);
        return await this.userRepository.save(newUser);
    }

    // READ ALL
    async findAll(): Promise<Users[]> {
        return await this.userRepository.find();
    }

    // READ ONE
    async findOne(id: number): Promise<Users> {
        const user = await this.userRepository.findOne({ where: { user_id: id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    // UPDATE
    async update(id: number, data: Partial<Users>): Promise<Users> {
        const user = await this.findOne(id);
        Object.assign(user, data);
        return await this.userRepository.save(user);
    }

    // DELETE
    async remove(id: number): Promise<void> {
        const user = await this.findOne(id);
        await this.userRepository.remove(user);
    }

    // GET ALL AUDIT LOGS FOR A USER
    async findAuditLogsForUser(userId: number): Promise<Audit_log[]> {
        return await this.auditLogRepository.find({ where: { user_id: userId } });
    }

    // GET ALL REPORTS ASSIGNED TO A USER
    async findReportsAssignedToUser(userId: number): Promise<Reports[]> {
        return await this.reportsRepository.find({
            where: { users: { user_id: userId } },
            relations: ['users'],
        });
    }


    // GET ALL REPORTS CREATED BY A USER
    async findReportsCreatedByUser(userId: number): Promise<Reports[]> {
        return await this.reportsRepository.find({
            where: { created_by: userId },
            relations: ['users'],
        });
    }

}