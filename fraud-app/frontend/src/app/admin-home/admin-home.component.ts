import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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
  priority: string;
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

  isAdvancedUser: boolean = false; // Default to false; toggle based on user role




  // Dummy reports data
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
    // Add more dummy data as needed
  ];
  

  currentReport: Report | null = this.dummyReports[0];

  
  // Dummy annotations data
dummyAnnotations = [
  { content: 'Initial investigation started.', created_at: new Date() },
  { content: 'Awaiting further details from the audit team.', created_at: new Date() },
];

// New annotation input
newAnnotation: string = '';


constructor() {
  // Example: Set `isAdvancedUser` based on a role (for now, toggle manually)
  this.isAdvancedUser = true; // Simulate an admin user; set dynamically in the future
}

// Method to add a new annotation
addAnnotation() {
  if (this.newAnnotation.trim()) {
    this.dummyAnnotations.push({
      content: this.newAnnotation,
      created_at: new Date(),
    });
    this.newAnnotation = ''; // Clear the input

    // Automatically change status to "In Progress" if current report is "Assigned"
    if (this.currentReport?.status === 'Assigned') {
      this.currentReport.status = 'In Progress';
    }
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

  viewAllReports() {
    alert('Displaying all assigned reports (Placeholder for now).');
  }

  editReport() {
    alert('Edit report functionality is not implemented yet.');
  }
  
  deleteReport() {
    alert('Delete report functionality is not implemented yet.');
  }
  
  reassignReport() {
    alert('Reassign report functionality is not implemented yet.');
  }


  toggleAdvancedUser() {
    this.isAdvancedUser = !this.isAdvancedUser;
  }
  
}
