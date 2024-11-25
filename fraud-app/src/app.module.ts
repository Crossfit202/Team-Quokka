import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditLogModule } from './audit_log/audit_log.module';
import { ReportAnnotationsModule } from './report_annotations/report_annotations.module';
import { ReportStatusHistoryModule } from './report_status_history/report_status_history.module';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';
import { Audit_log } from './audit_log/audit_log';
import { Report_annotations } from './report_annotations/report_annotations';
import { Report_status_history } from './report_status_history/report_status_history';
import { Reports } from './reports/reports';
import { Users } from './users/users';

@Module({
  imports: [

    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),


    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT'), 10),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        ssl: {
          rejectUnauthorized: false,
        },
        autoLoadEntities: true,
        entities: [Audit_log, Report_annotations, Report_status_history, Reports, Users],
        synchronize: true,
      }),
    }),


    AuditLogModule,
    ReportAnnotationsModule,
    ReportStatusHistoryModule,
    ReportsModule,
    UsersModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule { }