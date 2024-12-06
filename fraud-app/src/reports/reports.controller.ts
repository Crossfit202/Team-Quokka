import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
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

  //GET reports assigned to userID
  @Get('assigned/:userId')
  async findAssignedReports(
    @Param('userId') userId: number,
    @Query('statuses') statuses?: string
  ): Promise<Reports[]> {
    //Only getting reports with "assigned" and "In Progress" statuses.
    const statusArray = statuses ? statuses.split(',') : ['Assigned', 'In Progress'];
    return await this.ReportsService.findAssignedReportsByStatuses(userId, statusArray);
  }



  //GET report by ticket number
  @Get('ticket/:id')
  async findOneByTicket(@Param('id') id: string): Promise<Reports> {
    return await this.ReportsService.findOneByTicket(id);
  }

  // PUT 
  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<Reports>): Promise<Reports> {
    return await this.ReportsService.update(id, data);
  }

  @Put(':id/submit-for-review')
  async submitForReview(
    @Param('id') id: number,
    @Body('userId') userId: number
  ): Promise<Reports> {
    return await this.ReportsService.submitForReview(id, userId);
  }






  @Put(':id/approve')
  async approveReport(@Param('id') reportId: number): Promise<Reports> {
    console.log(`Approve API called for report ID: ${reportId}`); // Debug log
    return await this.ReportsService.approveReport(reportId);
  }





  @Put(':id/deny')
  async denyReport(
    @Param('id') reportId: number,
    @Body('currentUserId') currentUserId: number
  ): Promise<Reports> {
    return await this.ReportsService.denyReport(reportId);
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
