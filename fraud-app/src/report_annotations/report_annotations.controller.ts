import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ReportAnnotationsService } from './report_annotations.service';
import { Report_annotations } from './report_annotations';

@Controller('annotations')
export class ReportAnnotationsController {
  constructor(private readonly reportAnnotationsService: ReportAnnotationsService) { }

  
  @Post()
  async create(@Body() data: { annotation_text: string; reportKey: number; userKey: number }): Promise<Report_annotations> {
    // Call service to create the annotation
    return await this.reportAnnotationsService.create(data);
  }


  // GET all users
  @Get()
  async findAll(): Promise<Report_annotations[]> {
    return await this.reportAnnotationsService.findAll();
  }

  // GET by ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Report_annotations> {
    return await this.reportAnnotationsService.findOne(id);
  }

  //GET ANNOTATIONS BY REPORT ID
  @Get('/report/:id')
  async findAnnotationsByReportId(@Param('id') id: number): Promise<Report_annotations[]> {
    return await this.reportAnnotationsService.findAnnotationsByReportId(id);
  }



  // PUT  Update a user by ID
  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<Report_annotations>): Promise<Report_annotations> {
    return await this.reportAnnotationsService.update(id, data);
  }

  // DELETE  Delete a user by ID
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.reportAnnotationsService.remove(id);
  }
}
