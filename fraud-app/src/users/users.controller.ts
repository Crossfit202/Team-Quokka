import { Controller, Get, Post, Param, Body, Put, Delete, HttpCode, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './users';
import { Reports } from 'src/reports/reports';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { LoginDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService,
    private readonly authService: AuthService
  ) { }

  // Define a POST endpoint at 'users/login' for user login
  @Post('/login')
  @HttpCode(200)
  async login(@Body() loginUserDTO: LoginDto) {
    return await this.authService.validateLogin(loginUserDTO) // Await the promise
  }

  // POST 
  @Post()
  async create(@Body() data: Partial<Users>): Promise<Users> {
    return await this.userService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('whoami')
  @HttpCode(200)
  async getUserInfo(@Request() req: any) {
    const user = await this.userService.getById(req.user.sub)
    console.log(user)
    return user
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
