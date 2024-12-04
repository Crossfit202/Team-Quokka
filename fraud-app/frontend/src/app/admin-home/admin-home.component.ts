import { Component, Input, OnInit } from '@angular/core';
import { ReportsService } from '../services/reports.service';
import { UserStateService } from '../services/user-state.service'; // Import UserStateService
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LambdaService } from '../lambda.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
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
      this.fetchAssignedReports(this.loggedInUser.user_id);
    }
  }

  fetchReports(userId: number) {
    this.reportsService.getAssignedReports(userId).subscribe({
      next: (data) => {
        this.reports = data;
        if (this.reports.length > 0) {
          this.selectReport(this.reports[0]);
        }
      },
      error: (err) => {
        console.error('Error fetching reports:', err);
      },
    });
  }
  fetchAssignedReports(userId: number) {
    this.reportsService.getAssignedReports(userId).subscribe({
      next: (data) => {
        this.reports = data;
        if (this.reports.length > 0) {
          this.selectReport(this.reports[0]);
        }
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
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}'); // Get logged-in user
    const userId = loggedInUser.user_id; // Extract user ID
  
    if (this.newAnnotation.trim() && this.currentReport) {
      const annotationData = {
        annotation_text: this.newAnnotation,
        userKey: this.loggedInUser?.user_id, // Retrieved from localStorage
        reportKey: this.currentReport?.report_id, // The selected report ID
      };
  
      this.reportsService.createAnnotation(annotationData).subscribe({
        next: (response) => {
          console.log('Annotation created:', response);
          this.currentAnnotations.push(response); // Add new annotation to the UI
          this.newAnnotation = ''; // Clear the input field
  
          // Update the report's status to "In Progress"
          const updatedStatus = { status: 'In Progress' };
          this.reportsService.updateReport(this.currentReport.report_id, updatedStatus).subscribe({
            next: () => {
              console.log('Report status updated to In Progress');
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
    this.reportsService.updateReport(reportId, { status: 'Closed' }).subscribe({
      next: () => {
        alert('Report approved successfully.');
        this.fetchAssignedReports(this.currentReport.report_id); // Refresh the list to remove the closed report
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
          usersUserId: previousUserId, // Assign it back to the original user
        }).subscribe({
          next: () => {
            alert('Report denied and sent back successfully.');
            this.fetchAssignedReports(this.currentReport.report_id); // Refresh the list
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
    const currentUser = this.userStateService.getUser(); // Fetch the current logged-in user
    this.reportsService.updateReport(reportId, {
      status: 'Under Review',
      previous_user: currentUser.user_id, // Set the previous user field
    }).subscribe({
      next: () => {
        alert('Report submitted for review successfully.');
        this.fetchAssignedReports(this.currentReport.report_id); // Refresh the list of reports
      },
      error: (err) => {
        console.error('Error submitting report for review:', err);
        alert('Failed to submit report for review.');
      },
    });
  }
  
  
  

}
