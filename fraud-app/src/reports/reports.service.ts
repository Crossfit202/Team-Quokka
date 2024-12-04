import { Injectable, NotFoundException } from '@nestjs/common';
import { Reports } from './reports';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportAnnotationsService } from 'src/report_annotations/report_annotations.service';
import { Users } from 'src/users/users';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Reports)
        private readonly reportRepository: Repository<Reports>,
        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>
    ) { }


    async create(data: Partial<Reports>): Promise<Reports> {
        // Generate unique ticket number
        const timestamp = Date.now();
        const randomNum = Math.floor(Math.random() * 1000);
        data.ticket_number = `TICK${timestamp}${randomNum}`;
    
        // Fetch all admin1 and admin2 users
        const admins = await this.userRepository.find({
            where: [
                { role: 'admin' },
                { role: 'admin2' },
            ],
        });
    
        if (admins.length === 0) {
            throw new Error('No admin users found for assignment.');
        }
    
        // Find the least-loaded admin among admin1 and admin2
        const adminLoad = await Promise.all(
            admins.map(async (admin) => {
                const reportCount = await this.reportRepository.count({
                    where: { users: { user_id: admin.user_id } },
                });
                return { admin, reportCount };
            })
        );
    
        const leastLoadedAdmin = adminLoad.sort((a, b) => a.reportCount - b.reportCount)[0].admin;
    
        // Assign the report to the least-loaded admin
        data.users = leastLoadedAdmin;
    
        // Initialize previous_user as null (or a default value like 0)
        data.previous_user = 0; // Explicitly set as null or 0
    
        const newReport = this.reportRepository.create(data);
        return await this.reportRepository.save(newReport);
    }
    


    // READ ALL
    async findAll(): Promise<Reports[]> {
        return await this.reportRepository.find();
    }

    // READ ONE REPORT BY ID
    async findOne(id: number): Promise<Reports> {
        const report = await this.reportRepository.findOne({ where: { report_id: id } });
        if (!report) {
            throw new NotFoundException(`Report with ID ${id} not found`);
        }
        return report;
    }

    // READ ONE REPORT BY TICKET NUMBER
    async findOneByTicket(id: string): Promise<Reports> {
        const report = await this.reportRepository.findOne({ where: { ticket_number: id } });
        if (!report) {
            throw new NotFoundException(`Report with Ticket Number ${id} not found`);
        }
        return report;
    }

    // UPDATE
    async update(id: number, data: Partial<Reports>): Promise<Reports> {
        const report = await this.findOne(id);
        Object.assign(report, {
            ...data,
            updated_at: new Date(), // Set updated_at to the current time
        });
        return await this.reportRepository.save(report);
    }

    // DELETE
    async remove(id: number): Promise<void> {
        const report = await this.findOne(id);
        await this.reportRepository.remove(report);
    }


    async submitForReview(reportId: number, userId: number): Promise<Reports> {
        const report = await this.findOne(reportId);
        
        if (!report) {
            throw new Error(`Report with ID ${reportId} not found`);
        }
    
        // Update previous_user and assign to a different admin2
        report.previous_user = report.users.user_id;
        
        const admin2Users = await this.userRepository.find({ where: { role: 'admin2' } });
        if (admin2Users.length === 0) {
            throw new Error('No admin2 users available for reassignment.');
        }
    
        const leastLoadedAdmin2 = await this.findLeastLoadedAdmin(admin2Users);
        report.users = leastLoadedAdmin2;
    
        // Update status to "Under Review"
        report.status = 'Under Review';
        report.updated_at = new Date();
    
        return await this.reportRepository.save(report);
    }
    
    private async findLeastLoadedAdmin(admins: Users[]): Promise<Users> {
        const adminLoad = await Promise.all(
            admins.map(async (admin) => {
                const reportCount = await this.reportRepository.count({
                    where: { users: { user_id: admin.user_id }, status: 'Under Review' },
                });
                return { admin, reportCount };
            })
        );
        return adminLoad.sort((a, b) => a.reportCount - b.reportCount)[0].admin;
    }
    

    async findAssignedReports(userId: number): Promise<Reports[]> {
        return await this.reportRepository.createQueryBuilder('report')
            .where('report.usersUserId = :userId', { userId })
            .andWhere('report.status IN (:...statuses)', { statuses: ['Assigned', 'In Progress'] })
            .getMany();
    }

    async findAssignedReportsByStatuses(userId: number, statuses: string[]): Promise<Reports[]> {
        return await this.reportRepository.createQueryBuilder('report')
            .where('report.usersUserId = :userId', { userId })
            .andWhere('report.status IN (:...statuses)', { statuses })
            .getMany();
    }
    
    
      

    async approveReport(reportId: number): Promise<Reports> {
        const report = await this.findOne(reportId);
    
        if (!report) {
            throw new Error(`Report with ID ${reportId} not found`);
        }
    
        // Update previous_user and clear current user assignment
        report.previous_user = report.users.user_id;
        report.users = null; // No user assignment for closed reports
        report.status = 'Closed';
        report.updated_at = new Date();
    
        return await this.reportRepository.save(report);
    }
    
    

    async denyReport(reportId: number): Promise<Reports> {
        const report = await this.findOne(reportId);
    
        if (!report) {
            throw new Error(`Report with ID ${reportId} not found`);
        }
    
        // Reassign the report back to the previous user
        if (!report.previous_user) {
            throw new Error(`Cannot deny report: No previous user found.`);
        }
    
        const previousUser = await this.userRepository.findOne({ where: { user_id: report.previous_user } });
    
        if (!previousUser) {
            throw new Error(`Previous user with ID ${report.previous_user} not found`);
        }
    
        report.users = previousUser;
        report.previous_user = null; // Clear previous_user after reassignment
        report.status = 'In Progress';
        report.updated_at = new Date();
    
        return await this.reportRepository.save(report);
    }
    


}
