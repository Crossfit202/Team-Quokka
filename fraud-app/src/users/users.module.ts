import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users';
import { ReportsModule } from 'src/reports/reports.module';
import { AuditLogModule } from 'src/audit_log/audit_log.module';
import { ReportAnnotationsModule } from 'src/report_annotations/report_annotations.module';


@Module({
  imports: [TypeOrmModule.forFeature([Users]),
  forwardRef(() => ReportsModule),
  forwardRef(() => AuditLogModule),
  forwardRef(() => ReportAnnotationsModule)],
  exports: [TypeOrmModule, UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule { }
