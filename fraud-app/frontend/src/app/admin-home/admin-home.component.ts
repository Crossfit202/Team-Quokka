import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ElementRef, ViewChild } from '@angular/core';


interface Report {
  report_id: number;
  ticket_number: string;
  report_type: string;
  description: string;
  perpetrator: string;
  incident_location: string;
  monetary_damage: string;
  additional_damage1: boolean;
  additional_damage2: boolean;
  ongoing: string;
  discovery_method: string;
  status: string;
  priority: 'High' | 'Medium' | 'Low';
  created_at: Date;
  updated_at: Date;
}

@Component({
  selector: 'app-admin-home',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
})
export class AdminHomeComponent {
  isAdvancedUser: boolean = true; // Default to true; toggle based on user role
  @ViewChild('annotationsContainer') annotationsContainer!: ElementRef;
  currentAnnotations: { report_id: number; content: string; created_at: Date }[] = [];
  newAnnotation: string = '';

  // Dummy Reports Data
  dummyReports: Report[] = [
    {
      report_id: 1,
      ticket_number: 'ABC123',
      report_type: 'Fraud',
      description: 'Unauthorized transactions detected.',
      perpetrator: 'John Doe',
      incident_location: 'Main Office',
      monetary_damage: '15000',
      additional_damage1: true,
      additional_damage2: false,
      ongoing: 'Yes',
      discovery_method: 'Audit',
      status: 'Assigned',
      priority: 'High',
      created_at: new Date('2024-11-01'),
      updated_at: new Date('2024-11-20'),
    },
    {
      report_id: 2,
      ticket_number: 'DEF456',
      report_type: 'Theft',
      description: 'Missing inventory from warehouse.',
      perpetrator: 'Jane Smith',
      incident_location: 'Warehouse',
      monetary_damage: '2000',
      additional_damage1: false,
      additional_damage2: false,
      ongoing: 'No',
      discovery_method: 'Customer Complaint',
      status: 'Assigned',
      priority: 'Medium',
      created_at: new Date('2024-11-02'),
      updated_at: new Date('2024-11-21'),
    },
    {
      report_id: 3,
      ticket_number: 'GHI789',
      report_type: 'Cybersecurity Breach',
      description: 'Unauthorized access to employee data.',
      perpetrator: 'Unknown',
      incident_location: 'IT Department',
      monetary_damage: '100000',
      additional_damage1: true,
      additional_damage2: true,
      ongoing: 'Yes',
      discovery_method: 'Internal Audit',
      status: 'Assigned',
      priority: 'High',
      created_at: new Date('2024-11-03'),
      updated_at: new Date('2024-11-22'),
    },
    {
      report_id: 4,
      ticket_number: 'JKL012',
      report_type: 'Bribery',
      description: 'Suspicious payments to contractors.',
      perpetrator: 'Contractor',
      incident_location: 'Regional Office',
      monetary_damage: '5000',
      additional_damage1: false,
      additional_damage2: true,
      ongoing: 'No',
      discovery_method: 'Anonymous Tip',
      status: 'Assigned',
      priority: 'Low',
      created_at: new Date('2024-11-04'),
      updated_at: new Date('2024-11-23'),
    },
    {
      report_id: 5,
      ticket_number: 'MNO345',
      report_type: 'Fraud',
      description: 'Suspicious reimbursement claims.',
      perpetrator: 'Employee A',
      incident_location: 'Head Office',
      monetary_damage: '3000',
      additional_damage1: true,
      additional_damage2: false,
      ongoing: 'Yes',
      discovery_method: 'Expense Report Review',
      status: 'Assigned',
      priority: 'Medium',
      created_at: new Date('2024-11-05'),
      updated_at: new Date('2024-11-24'),
    },
  ];

  currentReport: Report | null = this.dummyReports[0];

  // Dummy Annotations Data
  dummyAnnotations = [
    { report_id: 1, content: 'Initial investigation started.', created_at: new Date() },
    { report_id: 1, content: 'Awaiting further details from the audit team.', created_at: new Date() },
    { report_id: 2, content: 'Inventory checked, awaiting follow-up.', created_at: new Date() },
    { report_id: 3, content: 'Breach reported to IT security.', created_at: new Date() },
  ];

  get sortedReports(): Report[] {
    return this.dummyReports
      .slice()
      .sort((a, b) => {
        // Priority sorting (High > Medium > Low)
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        const priorityA = priorityOrder[a.priority] || 0;
        const priorityB = priorityOrder[b.priority] || 0;
  
        if (priorityA !== priorityB) {
          return priorityB - priorityA; // Higher priority comes first
        }
  
        // Date sorting (Oldest first)
        return a.created_at.getTime() - b.created_at.getTime();
      });
  }
  

  selectReport(report: Report): void {
    this.currentReport = report;

    // Fetch annotations for the selected report
    this.currentAnnotations = this.dummyAnnotations.filter(
      (annotation) => annotation.report_id === report.report_id
    );
  }

  addAnnotation() {
    if (this.newAnnotation.trim() && this.currentReport) {
      const newAnnotation = {
        report_id: this.currentReport.report_id,
        content: this.newAnnotation,
        created_at: new Date(),
      };

      this.dummyAnnotations.push(newAnnotation);
      this.currentAnnotations.push(newAnnotation); // Update current annotations
      this.newAnnotation = ''; // Clear input

      // Scroll to the bottom
      this.scrollToBottom();
    }
  }

  private scrollToBottom() {
    if (this.annotationsContainer) {
      const element = this.annotationsContainer.nativeElement;
      setTimeout(() => {
        element.scrollTop = element.scrollHeight;
      }, 0);
    }
  }

  markAsCompleted(reportId: number | undefined) {
    if (!reportId) {
      console.error('Invalid report ID');
      return;
    }
    const report = this.dummyReports.find((r) => r.report_id === reportId);
    if (report) {
      report.status = 'Completed';
      alert(`Report ${report.ticket_number} marked as completed.`);
      this.fetchNextReport();
    }
  }

  fetchNextReport() {
    this.currentReport = this.dummyReports.find((r) => r.status === 'Assigned') || null;
  }

  toggleAdvancedUser() {
    this.isAdvancedUser = !this.isAdvancedUser;
  }
}
