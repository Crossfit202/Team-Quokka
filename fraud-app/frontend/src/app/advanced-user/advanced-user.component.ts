import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminHomeComponent } from "../admin-home/admin-home.component";
import { ReportsService } from '../services/reports.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-advanced-user',
  standalone: true,
  templateUrl: './advanced-user.component.html',
  styleUrls: ['./advanced-user.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, AdminHomeComponent, HeaderComponent],
})
export class AdvancedUserComponent implements OnInit {
  currentView: 'dashboard' | 'viewReports' | 'reviewReports' | 'editReports' | 'deleteReports' | null = 'dashboard';
  activeCard: string | null = null;
  deleteReportId: string = '';
  confirmationInput: string = '';
  selectedReport: any | null = null;
  currentAnnotations: any[] = [];
  reportSearchClicked: boolean = false;
  editableFields: { label: string; key: string; value: string; editing: boolean }[] = [];
  hasChanges: boolean = false;
  showConfirmation: boolean = false;
  modalTitle: string = '';
  modalMessage: string = '';
  isSaveEnabled: boolean = false;

  constructor(private reportsService: ReportsService) { }

  ngOnInit(): void {
    console.log('Advanced User Component Initialized');
  }


  // Set the current view
  setCurrentView(view: 'dashboard' | 'viewReports' | 'reviewReports' | 'editReports' | 'deleteReports'): void {
    this.currentView = view;
  }

  // Fetch report by ticket number
  findReport(): void {
    if (!this.deleteReportId.trim()) {
      alert('Please enter a valid ticket number.');
      return;
    }

    this.reportSearchClicked = true;

    this.reportsService.getReportByTicket(this.deleteReportId).subscribe({
      next: (report) => {
        this.selectedReport = report;
        this.initializeEditableFields(); // Initialize editable fields
        if (report?.report_id) {
          this.fetchAnnotations(report.report_id); // Fetch associated annotations
        }
      },
      error: () => {
        this.selectedReport = null;
        this.currentAnnotations = [];
        alert('Report not found.');
      },
    });
  }

  // Fetch annotations for the selected report
  fetchAnnotations(reportId: number): void {
    this.reportsService.getAnnotationsByReportId(reportId).subscribe({
      next: (annotations) => {
        this.currentAnnotations = annotations;
      },
      error: () => {
        this.currentAnnotations = [];
        alert('Failed to fetch annotations.');
      },
    });
  }

  // Reset focus and inputs
  resetFocus(): void {
    this.deleteReportId = '';
    this.selectedReport = null;
    this.currentAnnotations = [];
    this.activeCard = null;
    this.editableFields = [];
    this.setCurrentView('dashboard');
  }

  // Delete the selected report
  deleteReport(): void {
    if (!this.selectedReport) {
      alert('No report selected for deletion.');
      return;
    }

    const reportId = this.selectedReport.report_id;
    this.reportsService.deleteReportById(reportId).subscribe({
      next: () => {
        this.modalTitle = 'Report Deleted';
        this.modalMessage = `The report with Ticket Number ${this.selectedReport.ticket_number} has been successfully deleted.`;
        this.showConfirmation = true;
        this.resetFocus();
      },
      error: () => {
        alert('Failed to delete the report.');
      },
    });
  }

  // Initialize editable fields
  initializeEditableFields(): void {
    if (this.selectedReport) {
      this.editableFields = [
        { label: 'Report Type', key: 'report_type', value: this.selectedReport.report_type, editing: false },
        { label: 'Description', key: 'description', value: this.selectedReport.description, editing: false },
        { label: 'Perpetrator', key: 'perpetrator', value: this.selectedReport.perpetrator, editing: false },
        { label: 'Incident Location', key: 'incident_location', value: this.selectedReport.incident_location, editing: false },
        { label: 'Business Name', key: 'business_name', value: this.selectedReport.business_name, editing: false },
        { label: 'Business Address', key: 'business_address', value: this.selectedReport.business_address, editing: false },
        { label: 'Suspect Name', key: 'suspect_name', value: this.selectedReport.suspect_name, editing: false },
        { label: 'Monetary Damage', key: 'monetary_damage', value: this.selectedReport.monetary_damage, editing: false },
        { label: 'Reputation Damage', key: 'reputation_damage', value: this.selectedReport.reputation_damage, editing: false },
        { label: 'Customer Retention Affected', key: 'customer_retention', value: this.selectedReport.customer_retention, editing: false },
        { label: 'Discovery Method', key: 'discovery_method', value: this.selectedReport.discovery_method, editing: false },
        { label: 'Priority', key: 'priority', value: this.selectedReport.priority, editing: false },
        // Add new fields here
        
      ];
      
    }
  }

  // Track changes made to fields
  trackChanges(key: string, value: string): void {
    if (this.selectedReport) {
      const oldValue = (this.selectedReport as any)[key];
      if (oldValue !== value) {
        (this.selectedReport as any)[key] = value; // Update the field value
        this.hasChanges = true; // Enable save button
      }
    }
  }

  // Save changes to the report
  // advanced-user.component.ts
  saveChanges(): void {
    if (!this.selectedReport) {
      alert('No report selected to save.');
      return;
    }

    const reportId = this.selectedReport.report_id;
    this.reportsService.updateReport(reportId, this.selectedReport).subscribe({
      next: () => {
        this.isSaveEnabled = false; // Disable save button after saving
        this.modalTitle = 'Success';
        this.modalMessage = 'Your changes have been saved successfully.';
        this.showConfirmation = true;

        // Optionally, refresh the report data
        this.findReport();
      },
      error: () => {
        this.modalTitle = 'Error';
        this.modalMessage = 'Failed to save changes. Please try again.';
        this.showConfirmation = true;
      },
    });
  }

  // advanced-user.component.ts
  addAnnotation(annotationText: string): void {
    if (!this.selectedReport) {
      alert('No report selected to add an annotation.');
      return;
    }

    const annotationData = {
      annotation_text: annotationText,
      reportKey: this.selectedReport.report_id,
      userKey: 1, // Replace with actual logged-in user ID
    };

    this.reportsService.createAnnotation(annotationData).subscribe({
      next: (response) => {
        console.log('Annotation added:', response);

        // Refresh annotations and updated_at
        this.fetchAnnotations(this.selectedReport.report_id);
        this.findReport(); // Refresh report to see updated_at
      },
      error: (err) => {
        console.error('Error adding annotation:', err);
        alert('Failed to add annotation. Please try again.');
      },
    });
  }



  // Close the confirmation modal
  closeConfirmation(): void {
    this.showConfirmation = false;
  }

  // Close the modal
  closeModal(): void {
    this.showConfirmation = false;
  }


}
