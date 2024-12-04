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


    async submitForReview(reportId: number): Promise<Reports> {
        const report = await this.findOne(reportId);

        // Fetch all admin2 users
        const admin2Users = await this.userRepository.find({
            where: { role: 'admin2' },
        });

        if (admin2Users.length === 0) {
            throw new Error('No admin2 users found for reassignment.');
        }

        // Find the least-loaded admin2
        const adminLoad = await Promise.all(
            admin2Users.map(async (admin) => {
                const reportCount = await this.reportRepository.count({
                    where: { users: { user_id: admin.user_id } },
                });
                return { admin, reportCount };
            })
        );

        const leastLoadedAdmin = adminLoad.sort((a, b) => a.reportCount - b.reportCount)[0].admin;

        // Update the report's status and assign it to the least-loaded admin2
        report.status = 'Under Review';
        report.users = leastLoadedAdmin;

        return await this.reportRepository.save(report);
    }

    async findAssignedReports(userId: number): Promise<Reports[]> {
        return await this.reportRepository.find({
          where: { users: { user_id: userId } },
          relations: ['users'], // Ensure the relation is loaded
          order: { priority: 'DESC', created_at: 'ASC' }, // Sort by priority, then creation date
        });
      }
      

      async approveReport(reportId: number, currentUserId: number): Promise<Reports> {
        const report = await this.findOne(reportId);
    
        // Update previous_user and unassign the current user
        report.previous_user = report.users?.user_id || 0; // Set to current user's ID
        report.users = null; // Unassign the report
        report.status = 'Closed'; // Update status to 'Closed'
        report.updated_at = new Date(); // Update the timestamp
    
        return await this.reportRepository.save(report);
    }
    

    async denyReport(reportId: number): Promise<Reports> {
        const report = await this.findOne(reportId);

        // Ensure the report has an assigned user
        if (!report.users) {
            throw new Error('Cannot deny report: No user assigned to this report.');
        }

        // Update the report's status
        report.status = 'In Progress';

        // Reassign the report back to the same user
        const originalUser = report.users;
        report.users = originalUser;

        return await this.reportRepository.save(report);
    }


}
