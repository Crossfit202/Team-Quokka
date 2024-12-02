import { Component } from '@angular/core';
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
export class AdvancedUserComponent {
  currentView: 'dashboard' | 'viewReports' | 'approveReports' | null = 'dashboard';
  activeCard: string | null = null;
  deleteReportId: string = '';
  confirmationInput: string = '';
  selectedReport: any | null = null;
  currentAnnotations: any[] = [];
  reportSearchClicked: boolean = false;

  constructor(private reportsService: ReportsService) { }

  // Set the current view
  setCurrentView(view: 'dashboard' | 'viewReports' | 'approveReports'): void {
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
        this.resetFocus();
      },
      error: () => {
        alert('Failed to delete the report.');
      },
    });
  }
}
