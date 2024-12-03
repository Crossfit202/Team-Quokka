import { forwardRef, Module } from '@nestjs/common';
import { ReportAnnotationsService } from './report_annotations.service';
import { ReportAnnotationsController } from './report_annotations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogModule } from 'src/audit_log/audit_log.module';
import { ReportStatusHistoryModule } from 'src/report_status_history/report_status_history.module';
import { Report_annotations } from './report_annotations';
import { Reports } from 'src/reports/reports';
import { Users } from 'src/users/users';
import { ReportsModule } from 'src/reports/reports.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report_annotations]),
    forwardRef(() => ReportsModule),
    forwardRef(() => Users),
    forwardRef(() => Reports)
  ],
  exports: [TypeOrmModule],
  controllers: [ReportAnnotationsController],
  providers: [ReportAnnotationsService],
})
export class ReportAnnotationsModule { }
