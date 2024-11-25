import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AuditLogService } from './audit_log.service';
import { Audit_log } from './audit_log';

@Controller('audit')
export class AuditLogController {
  reportAnnotationsService: any;
  constructor(private readonly auditLogService: AuditLogService) { }

  // POST Create a new audit log
  @Post()
  async create(@Body() data: Partial<Audit_log>): Promise<Audit_log> {
    return await this.auditLogService.create(data);
  }

  // GET ALL
  @Get()
  async findAll(): Promise<Audit_log[]> {
    return await this.auditLogService.findAll();
  }

  // GET  by ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Audit_log> {
    return await this.auditLogService.findOne(id);
  }

  // PUT 
  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<Audit_log>): Promise<Audit_log> {
    return await this.auditLogService.update(id, data);
  }

  // DELETE 
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.auditLogService.remove(id);
  }

  //GET ALL AUDIT LOGS MADE BY SPECIFIC USER
  @Get('/user/:id')
  async findAllByUserId(@Param('id') id: string): Promise<Audit_log[]> {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID');
    }
    return await this.auditLogService.findAllByUserId(userId);
  }

}
