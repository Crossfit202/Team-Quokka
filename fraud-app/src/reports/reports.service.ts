import { Injectable, NotFoundException } from '@nestjs/common';
import { Reports } from './reports';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Reports)
        private readonly reportRepository: Repository<Reports>,
    ) { }


    // CREATE
    async create(data: Partial<Reports>): Promise<Reports> {
        const newReport = this.reportRepository.create(data);
        return await this.reportRepository.save(newReport);
    }

    // READ ALL
    async findAll(): Promise<Reports[]> {
        return await this.reportRepository.find();
    }

    // READ ONE REPORT BY ID
    async findOne(id: number): Promise<Reports> {
        const report = await this.reportRepository.findOne({ where: { report_id: id } });
        if (!report) {
            throw new NotFoundException(`Report with ID ${id} not found`);
        }
        return report;
    }

    // READ ONE REPORT BY TICKET NUMBER
    async findOneByTicket(id: string): Promise<Reports> {
        const report = await this.reportRepository.findOne({ where: { ticket_number: id } });
        if (!report) {
            throw new NotFoundException(`Report with Ticket Number ${id} not found`);
        }
        return report;
    }

    // UPDATE
    async update(id: number, data: Partial<Reports>): Promise<Reports> {
        const report = await this.findOne(id);
        Object.assign(report, data);
        return await this.reportRepository.save(report);
    }

    // DELETE
    async remove(id: number): Promise<void> {
        const report = await this.findOne(id);
        await this.reportRepository.remove(report);
    }
}
