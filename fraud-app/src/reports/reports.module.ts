import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reports } from './reports';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { AuditLogModule } from '../audit_log/audit_log.module';
import { ReportAnnotationsModule } from '../report_annotations/report_annotations.module';
import { UsersModule } from '../users/users.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Reports]),
    forwardRef(() => AuditLogModule),
    forwardRef(() => UsersModule),
  ],
  providers: [ReportsService],
  controllers: [ReportsController],
  exports: [TypeOrmModule, ReportsService],
})
export class ReportsModule { }