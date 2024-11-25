import { Injectable, NotFoundException } from '@nestjs/common';
import { Report_status_history } from './report_status_history';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reports } from '../reports/reports';

@Injectable()
export class ReportStatusHistoryService {
    constructor(
        @InjectRepository(Report_status_history)
        private readonly reportStatusHistoryRepository: Repository<Report_status_history>,
        @InjectRepository(Reports)
        private readonly reportsRepository: Repository<Reports>,
    ) { }

    // CREATE
    async create(data: Partial<Report_status_history>): Promise<Report_status_history> {
        const newStatus = this.reportStatusHistoryRepository.create(data);
        return await this.reportStatusHistoryRepository.save(newStatus);
    }

    // READ ALL
    async findAll(): Promise<Report_status_history[]> {
        return await this.reportStatusHistoryRepository.find({
            relations: ['report'],
        });
    }


    // READ ONE
    async findOne(id: number): Promise<Report_status_history> {
        const status = await this.reportStatusHistoryRepository.findOne({ where: { status_id: id } });
        if (!status) {
            throw new NotFoundException(`Status with ID ${id} not found`);
        }
        return status;
    }

    async findAllByReportId(report_id: number): Promise<Report_status_history[]> {
        return await this.reportStatusHistoryRepository.find({
            where: { report: { report_id } },
            relations: ['report'],
        });
    }


    // UPDATE
    async update(id: number, data: Partial<Report_status_history>): Promise<Report_status_history> {
        const status = await this.findOne(id);
        Object.assign(status, data);
        return await this.reportStatusHistoryRepository.save(status);
    }

    // DELETE
    async remove(id: number): Promise<void> {
        const status = await this.findOne(id);
        await this.reportStatusHistoryRepository.remove(status);
    }
}
