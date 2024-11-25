import { forwardRef, Module } from '@nestjs/common';
import { AuditLogService } from './audit_log.service';
import { AuditLogController } from './audit_log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Audit_log } from './audit_log';
import { ReportsModule } from 'src/reports/reports.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Audit_log]),
    forwardRef(() => ReportsModule),
  ],
  providers: [AuditLogService],
  controllers: [AuditLogController],
  exports: [TypeOrmModule, AuditLogService],
})
export class AuditLogModule { }

