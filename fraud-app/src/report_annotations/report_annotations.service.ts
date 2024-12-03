import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report_annotations } from './report_annotations';
import { ReportsService } from 'src/reports/reports.service';

@Injectable()
export class ReportAnnotationsService {
    constructor(
        @InjectRepository(Report_annotations)
        private readonly reportAnnotationsRepository: Repository<Report_annotations>,
        private readonly reportsService: ReportsService // Inject ReportsService
    ) { }

    async create(data: Partial<Report_annotations>): Promise<Report_annotations> {
        console.log('Creating annotation with data:', data);

        // Set created_at if not provided
        if (!data.created_at) {
            data.created_at = new Date();
        }

        // Validate required fields
        if (!data.userKey || !data.reportKey || !data.annotation_text) {
            throw new Error('userKey, reportKey, and annotation_text are required to create an annotation');
        }

        const newAnnotation = this.reportAnnotationsRepository.create(data);
        const savedAnnotation = await this.reportAnnotationsRepository.save(newAnnotation);

        // Update the report's updated_at field
        await this.reportsService.update(data.reportKey, { updated_at: new Date() });

        return savedAnnotation;
    }




    // READ ALL
    async findAll(): Promise<Report_annotations[]> {
        return await this.reportAnnotationsRepository.find({
            relations: {
                reports: true, users: true
            }
        });
    }

    // READ ONE
    async findOne(id: number): Promise<Report_annotations> {
        const annotation = await this.reportAnnotationsRepository.findOne({
            where: { annotation_id: id }, relations: { reports: true, users: true }
        });
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
            select: ['annotation_id', 'annotation_text', 'created_at', 'reports'],
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
