import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Reports } from 'src/reports/reports';


@Controller('reports')
export class ReportsController {
  constructor(private readonly ReportsService: ReportsService) { }

  // POST a new user
  @Post()
  async create(@Body() data: Partial<Reports>): Promise<Reports> {
    return await this.ReportsService.create(data);
  }

  // GET all users
  @Get()
  async findAll(): Promise<Reports[]> {
    return await this.ReportsService.findAll();
  }

  // GET user by ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Reports> {
    return await this.ReportsService.findOne(id);
  }

  @Get('ticket/:id')
  async findOneByTicket(@Param('id') id: string): Promise<Reports> {
    return await this.ReportsService.findOneByTicket(id);
  }

  // PUT 
  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<Reports>): Promise<Reports> {
    return await this.ReportsService.update(id, data);
  }

  // DELETE 
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    const report = await this.ReportsService.findOne(id);
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    await this.ReportsService.remove(id);
  }

}
