import { Component, Input, OnInit } from '@angular/core';
import { ReportsService } from '../services/reports.service';
import { UserStateService } from '../services/user-state.service'; // Import UserStateService
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LambdaService } from '../lambda.service';
import { AuthService } from '../services/auth.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent]
})
export class AdminHomeComponent implements OnInit {

  @Input() isReviewMode: boolean = false; // Determines if Approve/Deny buttons are shown
  reports: any[] = [];
  currentReport: any | null = null;
  currentAnnotations: any[] = [];
  newAnnotation: string = '';
  loggedInUser: any = null; // Holds logged-in user data
  selectedReport: any | null = null;
  viewMode: any;
  currentView: string = 'assignedReports'; // Default view, adjust as necessary

  

  constructor(
    private authService: AuthService,
    private reportsService: ReportsService,
    private userStateService: UserStateService, // Inject UserStateService
    private lambdaService: LambdaService
  ) { }

  ngOnInit() {
    // Get the logged-in user from the UserStateService
    this.loggedInUser = this.userStateService.getUser();
    console.log('Logged-in user:', this.loggedInUser);

    // Fetch reports assigned to the logged-in user
    if (this.loggedInUser) {
      this.fetchAssignedReports();
    }
  }

  fetchAssignedReports(): void {
  const currentUser = this.userStateService.getUser();
  const statuses = this.currentView === 'reviewReports' ? 'Under Review' : 'Assigned,In Progress';

  this.reportsService.getAssignedReports(currentUser.user_id, statuses).subscribe({
    next: (reports) => {
      this.reports = reports;
    },
    error: (err) => {
      console.error('Error fetching assigned reports:', err);
    },
  });
}

  

  selectReport(report: any) {
    this.currentReport = report;

    // Fetch annotations for the selected report
    this.reportsService.getAnnotationsByReportId(report.report_id).subscribe({
      next: (annotations) => {
        this.currentAnnotations = annotations;
      },
      error: (err) => {
        console.error('Error fetching annotations:', err);
      },
    });
  }

  addAnnotation() {
    if (this.newAnnotation.trim() && this.currentReport) {
      const annotationData = {
        annotation_text: this.newAnnotation,
        userKey: this.loggedInUser?.user_id,
        reportKey: this.currentReport?.report_id,
      };
  
      this.reportsService.createAnnotation(annotationData).subscribe({
        next: (response) => {
          console.log('Annotation created:', response);
          this.currentAnnotations.push(response);
          this.newAnnotation = ''; // Clear the input
  
          // Update the report's status and refresh the current report
          this.reportsService.updateReport(this.currentReport.report_id, { status: 'In Progress' }).subscribe({
            next: () => {
              console.log('Report status updated to In Progress');
              // Refresh current report data
              this.reportsService.getReportById(this.currentReport.report_id).subscribe({
                next: (updatedReport) => {
                  this.currentReport = updatedReport; // Refresh the UI with the updated report
                },
                error: (err) => {
                  console.error('Error refreshing report:', err);
                },
              });
            },
            error: (err) => {
              console.error('Error updating report status:', err);
            },
          });
        },
        error: (err) => {
          console.error('Error adding annotation:', err);
          alert('Failed to add annotation!');
        },
      });
    }
  }
  
  
  
  invokeLambda() {  

    console.log("lambda has been invoked");

    this.lambdaService.callLambda(this.currentReport.report_id).subscribe(
      (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url); // Open PDF in a new tab
      },
      (error) => {
        console.error('Error downloading PDF:', error);
      }
    );
  }

  approveReport(reportId: number): void {
    const currentUser = this.userStateService.getUser();
  
    this.reportsService.updateReport(reportId, {
      status: 'Closed',
      previous_user: currentUser.user_id,
      usersUserId: null,
    }).subscribe({
      next: () => {
        alert('Report approved successfully.');
        // Remove the approved report from the list
        this.reports = this.reports.filter((report) => report.report_id !== reportId);
        this.currentReport = null; // Reset current report
      },
      error: (err) => {
        console.error('Error approving report:', err);
        alert('Failed to approve report.');
      },
    });
  }
  
  
  
  
  denyReport(reportId: number): void {
    this.reportsService.getReportById(reportId).subscribe({
      next: (report) => {
        const previousUserId = report.previous_user;
        if (!previousUserId) {
          alert('Error: No previous user found for this report.');
          return;
        }
  
        this.reportsService.updateReport(reportId, {
          status: 'In Progress',
          usersUserId: previousUserId,
          previous_user: null,
        }).subscribe({
          next: () => {
            alert('Report denied and sent back successfully.');
            // Remove the denied report from the list
            this.reports = this.reports.filter((r) => r.report_id !== reportId);
            this.currentReport = null; // Reset the current report
          },
          error: (err) => {
            console.error('Error denying report:', err);
            alert('Failed to deny report.');
          },
        });
      },
      error: (err) => {
        console.error('Error fetching report:', err);
        alert('Failed to fetch report details.');
      },
    });
  }
  
  
  
  
  

  submitForReview(reportId: number): void {
    const currentUser = this.userStateService.getUser();
  
    this.reportsService.updateReport(reportId, {
      status: 'Under Review',
      previous_user: currentUser.user_id,
    }).subscribe({
      next: () => {
        alert('Report submitted for review successfully.');
        // Remove the submitted report from the list
        this.reports = this.reports.filter((report) => report.report_id !== reportId);
        this.currentReport = null; // Reset the current report
      },
      error: (err) => {
        console.error('Error submitting report for review:', err);
        alert('Failed to submit report for review.');
      },
    });
  }
  
  
  
  
  

}
