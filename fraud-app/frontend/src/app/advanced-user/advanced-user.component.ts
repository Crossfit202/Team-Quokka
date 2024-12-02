import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminHomeComponent } from "../admin-home/admin-home.component";
import { ReportsService } from '../services/reports.service';

@Component({
  selector: 'app-advanced-user',
  standalone: true,
  templateUrl: './advanced-user.component.html',
  styleUrls: ['./advanced-user.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, AdminHomeComponent],
})
export class AdvancedUserComponent implements OnInit {
  currentView: 'dashboard' | 'viewReports' | 'approveReports' | 'editReports' | null = 'dashboard';
  activeCard: string | null = null;
  deleteReportId: string = '';
  confirmationInput: string = '';
  selectedReport: any | null = null;
  currentAnnotations: any[] = [];
  reportSearchClicked: boolean = false;
  editableFields: { label: string; key: string; value: string; editing: boolean }[] = [];
  hasChanges: boolean = false; // Track if changes are made
  showConfirmation: boolean = false;
  modalTitle: string = '';
  modalMessage: string = '';
  isSaveEnabled: boolean = false;




  constructor(private reportsService: ReportsService) { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  // Set the current view
  setCurrentView(view: 'dashboard' | 'viewReports' | 'approveReports' | 'editReports'): void {
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

        // Fetch associated annotations
        if (report?.report_id) {
          this.fetchAnnotations(report.report_id);
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
        alert(`Report "${this.selectedReport.ticket_number}" has been deleted.`);
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

  initializeEditableFields(): void {
    if (this.selectedReport) {
      this.editableFields = [
        { label: 'Report Type', key: 'report_type', value: this.selectedReport.report_type, editing: false },
        { label: 'Description', key: 'description', value: this.selectedReport.description, editing: false },
        { label: 'Perpetrator', key: 'perpetrator', value: this.selectedReport.perpetrator, editing: false },
        { label: 'Incident Location', key: 'incident_location', value: this.selectedReport.incident_location, editing: false },
        { label: 'Monetary Damage', key: 'monetary_damage', value: this.selectedReport.monetary_damage, editing: false },
        { label: 'Discovery Method', key: 'discovery_method', value: this.selectedReport.discovery_method, editing: false },
        { label: 'Priority', key: 'priority', value: this.selectedReport.priority, editing: false },
      ];
    }
  }
  
  
  

  // Update this method to enable save when any field changes
  updateSelectedReport(key: string, value: string): void {
    if (this.selectedReport && (this.selectedReport as any)[key] !== value) {
      (this.selectedReport as any)[key] = value;
      this.isSaveEnabled = true; // Enable save button
    }
  }

  saveChanges(): void {
    // Save changes logic here...
    console.log('Changes saved:', this.selectedReport);
    this.isSaveEnabled = false; // Disable save button after saving
    this.showConfirmation = true; // Display confirmation modal

    // Show confirmation modal
    this.modalTitle = 'Success';
    this.modalMessage = 'Your changes have been saved successfully.';
    this.showConfirmation = true;

    // Optionally, automatically close the modal after a few seconds
    setTimeout(() => {
      this.closeConfirmation();
    }, 3000); // Closes after 3 seconds
  }

  closeConfirmation(): void {
    this.showConfirmation = false;
  }

  trackChanges(key: string, value: string): void {
    if (this.selectedReport) {
      const oldValue = (this.selectedReport as any)[key];
      this.hasChanges = oldValue !== value; // Set `hasChanges` to true as soon as the value changes
    }
  }

  closeModal(): void {
    this.showConfirmation = false;
  }
  
  
}
