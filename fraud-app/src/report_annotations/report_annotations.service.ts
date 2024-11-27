import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report_annotations } from './report_annotations';

@Injectable()
export class ReportAnnotationsService {
    constructor(
        @InjectRepository(Report_annotations)
        private readonly reportAnnotationsRepository: Repository<Report_annotations>,
    ) { }

    // CREATE
    async create(data: Partial<Report_annotations>): Promise<Report_annotations> {
        const newAnnotation = this.reportAnnotationsRepository.create(data);
        return await this.reportAnnotationsRepository.save(newAnnotation);
    }

    // READ ALL
    async findAll(): Promise<Report_annotations[]> {
        return await this.reportAnnotationsRepository.find( {
            relations: {
                reports: true, users: true
            }
        });
    }

    // READ ONE
    async findOne(id: number): Promise<Report_annotations> {
        const annotation = await this.reportAnnotationsRepository.findOne({ 
            where: { annotation_id: id }, relations: { reports: true, users: true } });
        if (!annotation) {
            throw new NotFoundException(`Status with ID ${id} not found`);
        }
        return annotation;
    }

    async findAnnotationsByReportId(reportId: number): Promise<Report_annotations[]> {
        return await this.reportAnnotationsRepository.find({
            where: {
                reports: { report_id: reportId },
            },
            relations: ['reports'],
        });
    }


    // UPDATE
    async update(id: number, data: Partial<Report_annotations>): Promise<Report_annotations> {
        const annotation = await this.findOne(id);
        Object.assign(annotation, data);
        return await this.reportAnnotationsRepository.save(annotation);
    }

    // DELETE
    async remove(id: number): Promise<void> {
        const annotation = await this.findOne(id);
        await this.reportAnnotationsRepository.remove(annotation);
    }
}
