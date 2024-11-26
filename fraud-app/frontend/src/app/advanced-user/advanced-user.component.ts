import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminHomeComponent } from "../admin-home/admin-home.component";


interface Report {
  report_id: number; // Ensure this property exists
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
  selector: 'app-advanced-user',
  standalone: true,
  templateUrl: './advanced-user.component.html',
  styleUrls: ['./advanced-user.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, AdminHomeComponent], // Ensure necessary modules are imported
})

export class AdvancedUserComponent {

  constructor(private router: Router) {} // Inject Router service

  [x: string]: any;
  activeCard: string | null = null; // Tracks the active card
  deleteReportId: number | null = null;
  confirmationInput: string = '';
  editReportId: number | null = null;
  selectedReport: any = null; // Holds report for editing
  currentView: 'dashboard' | 'viewReports' = 'dashboard';
  currentReport: Report | null = null;
currentAnnotations: { content: string; created_at: Date }[] = []; // Annotations for the current report
newAnnotation: string = ''; // Holds input for a new annotation

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

dummyAnnotations = [
  { report_id: 1, content: 'Initial investigation started.', created_at: new Date() },
  { report_id: 1, content: 'Awaiting further details from the audit team.', created_at: new Date() },
  { report_id: 2, content: 'Inventory checked, awaiting follow-up.', created_at: new Date() },
];



setCurrentView(view: 'dashboard' | 'viewReports'): void {
  console.log(`Navigating to: ${view}`);
  this.currentView = view;
}



  focusOnCard(card: string) {
    this.activeCard = card;
  }

  resetFocus() {
    this.activeCard = null;
    this.deleteReportId = null;
    this.confirmationInput = '';
    this.editReportId = null;
    this.selectedReport = null;
  }

  deleteReport() {
    console.log(`Deleting report: ${this.deleteReportId}`);
    this.resetFocus();
  }

  editReport() {
    console.log(`Editing report: ${this.editReportId}`);
    this.selectedReport = { ticket_number: 'ABC123' }; // Example data
  }

  saveReportEdits() {
    console.log('Saving report edits:', this.selectedReport);
    this.resetFocus();
  }

  viewReports() {
    console.log('Navigating to Admin Home...');
    this.router.navigate(['/admin-home']);
  }
  


  viewReportsForReview() {
    console.log('Viewing reports for review');
  }

  // Select a report and fetch its annotations
  selectReport(report: Report): void {
    this.currentReport = report;
    this.currentAnnotations = this.dummyAnnotations.filter(
      (annotation) => annotation.report_id === report.report_id
    );
  }
  

// Return to the report list from the current report view
backToReportList(): void {
  this.currentReport = null;
}


// Add a new annotation to the current report
addAnnotation(): void {
  if (this.newAnnotation.trim() && this.currentReport) {
    const annotation = {
      report_id: this.currentReport.report_id,
      content: this.newAnnotation,
      created_at: new Date(),
    };

    // Add to dummy annotations and current annotations
    this.dummyAnnotations.push(annotation);
    this.currentAnnotations.push(annotation);

    // Clear the input field
    this.newAnnotation = '';
  }
}

// Sort reports by priority and creation date
get sortedReports(): Report[] {
  return this.dummyReports
    .slice()
    .sort((a, b) => {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      const priorityA = priorityOrder[a.priority] || 0;
      const priorityB = priorityOrder[b.priority] || 0;

      if (priorityA !== priorityB) return priorityB - priorityA;

      return a.created_at.getTime() - b.created_at.getTime();
    });
}


  
}

