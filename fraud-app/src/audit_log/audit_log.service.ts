import { Injectable, NotFoundException } from '@nestjs/common';
import { Audit_log } from './audit_log';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuditLogService {
    constructor(@InjectRepository(Audit_log)
    private readonly auditLogRepository: Repository<Audit_log>,
    ) { }

    // CREATE
    async create(data: Partial<Audit_log>): Promise<Audit_log> {
        const newAnnotation = this.auditLogRepository.create(data);
        return await this.auditLogRepository.save(newAnnotation);
    }

    // READ ALL
    async findAll(): Promise<Audit_log[]> {
        return await this.auditLogRepository.find();
    }

    // READ ONE
    async findOne(id: number): Promise<Audit_log> {
        const annotation = await this.auditLogRepository.findOne({ where: { action_id: id } });
        if (!annotation) {
            throw new NotFoundException(`Status with ID ${id} not found`);
        }
        return annotation;
    }

    // GET ALL AUDIT LOGS MADE BY SPECIFIC USER
    async findAllByUserId(id: number): Promise<Audit_log[]> {
        return await this.auditLogRepository.find({ where: { user_id: id } });
    }

    // UPDATE
    async update(id: number, data: Partial<Audit_log>): Promise<Audit_log> {
        const annotation = await this.findOne(id);
        Object.assign(annotation, data);
        return await this.auditLogRepository.save(annotation);
    }

    // DELETE
    async remove(id: number): Promise<void> {
        const annotation = await this.findOne(id);
        await this.auditLogRepository.remove(annotation);
    }
}
