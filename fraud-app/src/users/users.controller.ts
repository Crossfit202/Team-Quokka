import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './users';
import { Reports } from 'src/reports/reports';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  // POST 
  @Post()
  async create(@Body() data: Partial<Users>): Promise<Users> {
    return await this.userService.create(data);
  }

  // GET ALL
  @Get()
  async findAll(): Promise<Users[]> {
    return await this.userService.findAll();
  }

  // GET ONE
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Users> {
    return await this.userService.findOne(id);
  }

  // PUT 
  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<Users>): Promise<Users> {
    return await this.userService.update(id, data);
  }

  // DELETE
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.userService.remove(id);
  }

  // GET ALL REPORTS ASSIGNED TO A USER
  @Get(':id/assigned')
  async getReportsAssignedToUser(@Param('id') id: number): Promise<Reports[]> {
    return await this.userService.findReportsAssignedToUser(id);
  }

  // GET ALL REPORTS CREATED BY A USER
  @Get(':id/created')
  async getReportsCreatedByUser(@Param('id') id: number): Promise<Reports[]> {
    return await this.userService.findReportsCreatedByUser(id);
  }
}
