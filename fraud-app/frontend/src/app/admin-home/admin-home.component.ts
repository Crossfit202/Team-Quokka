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
  currentUser: any | null = null;


  constructor(
    private reportsService: ReportsService,
    private userStateService: UserStateService, // Inject UserStateService
    private lambdaService: LambdaService
  ) { }

  ngOnInit() {
    this.userStateService.getUser().subscribe(currentUser => {
      if (currentUser) {
        const statuses = this.getStatusesForView(); // Get statuses based on isReviewMode
        console.log(currentUser); // Log the current user object
        this.currentUser = currentUser;
        this.fetchAssignedReports(statuses, currentUser.user_id); // Pass user_id directly from currentUser
      } else {
        console.error('No logged-in user found.');
      }
    });
  }

  /**
   * Helper method to determine the statuses to fetch.
   * @returns An array of statuses based on the current mode.
   */
  getStatusesForView(): string[] {
    return this.isReviewMode ? ['Under Review'] : ['Assigned', 'In Progress'];
  }

  /**
   * Fetch reports assigned to the current user with the given statuses.
   * @param statuses - The report statuses to filter by.
   * @param userId - The ID of the current logged-in user.
   */

  fetchAssignedReports(statuses: string[], userId: number): void {
    this.reportsService.getAssignedReports(userId, statuses).subscribe({
      next: (reports) => {
        // Sort reports by priority: High -> Medium -> Low
        const priorityOrder: Record<string, number> = {
          High: 1,
          Medium: 2,
          Low: 3,
        };

        this.reports = reports.sort((a, b) => {
          const priorityA = priorityOrder[a.priority as keyof typeof priorityOrder] || 4;
          const priorityB = priorityOrder[b.priority as keyof typeof priorityOrder] || 4;
          return priorityA - priorityB;
        });

        if (this.reports.length > 0) {
          this.selectReport(this.reports[0]); // Select the first report by default
        } else {
          this.currentReport = null; // Clear the current report if none exist
        }
      },
      error: (err) => {
        console.error('Error fetching assigned reports:', err);
      },
    });
  }



  /**
   * Select a report to display its details and annotations.
   * @param report - The report to select.
   */
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

  /**
   * Add an annotation to the current report.
   */
  addAnnotation(): void {
    const userId = this.currentUser.user_id; // Extract user ID
    if (this.newAnnotation.trim() && this.currentReport) {
        const annotationData = {
            annotation_text: this.newAnnotation.trim(), // Ensure the text is trimmed
            userKey: userId, // Pass the user ID
            reportKey: this.currentReport.report_id, // Pass the report ID
        };

        console.log('Creating annotation with data:', annotationData); // Debug log

        this.reportsService.createAnnotation(annotationData).subscribe({
            next: (response) => {
                console.log('Annotation created:', response);
                this.currentAnnotations.push(response); // Add new annotation to the UI
                this.newAnnotation = ''; // Clear the input field

                if (this.currentReport.status === 'Assigned') {
                    const updatedStatus = { status: 'In Progress' };
                    this.reportsService.updateReport(this.currentReport.report_id, updatedStatus).subscribe({
                        next: () => {
                            console.log('Report status updated to In Progress');
                            this.currentReport.status = 'In Progress'; // Update local status
                        },
                        error: (err) => {
                            console.error('Error updating report status:', err);
                        },
                    });
                }
            },
            error: (err) => {
                console.error('Error adding annotation:', err);
                alert('Failed to add annotation!');
            },
        });
    } else {
        console.error('Invalid annotation data. Ensure all fields are provided.');
    }
}

  /**
   * Submit a report for review.
   * @param reportId - The ID of the report to submit.
   */
  submitForReview(reportId: number): void {
    const currentUser = this.userStateService.getUser(); // Get the logged-in user

    this.reportsService.submitReport(reportId, this.currentUser.user_id).subscribe({
      next: () => {
        alert('Report submitted for review successfully.');
        const statuses = ['Assigned', 'In Progress'];
        this.fetchAssignedReports(statuses, this.currentUser.user_id);
      },
      error: (err) => {
        console.error('Error submitting report for review:', err);
      },
    });

  }

  /**
   * Approve a report.
   * @param reportId - The ID of the report to approve.
   */
  approveReport(reportId: number): void {
    console.log(`Approve button clicked for report ID: ${reportId}`); // Debug log
    this.reportsService.approveReport(reportId).subscribe({
      next: () => {
        alert('Report approved successfully.');
        const statuses = this.getStatusesForView(); // Get the current statuses for the view
        const currentUser = this.userStateService.getUser(); // Fetch the logged-in user
        this.fetchAssignedReports(statuses, this.currentUser.user_id); // Refresh the report list
      },
      error: (err) => {
        console.error('Error approving report:', err);
      },
    });
  }

  /**
 * Invoke the Lambda function to generate a PDF for the current report.
 */

  invokeLambda(): void {
    if (!this.currentReport) {
      console.error('No report selected to invoke Lambda.');
      return;
    }

    console.log("Lambda invoked for report ID:", this.currentReport.report_id);

    this.lambdaService.callLambda(this.currentReport.report_id).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url); // Open the generated PDF in a new tab
      },
      error: (err) => {
        console.error('Error invoking Lambda:', err);
      },
    });
  }


  /**
   * Deny a report and reassign it back to the previous user.
   * @param reportId - The ID of the report to deny.
   */
  denyReport(reportId: number): void {
    this.reportsService.denyReport(reportId, this.currentUser.user_id).subscribe({
      next: () => {
        alert('Report denied successfully.');
        const statuses = this.getStatusesForView();
        this.fetchAssignedReports(statuses, this.currentUser.user_id); // Refresh the list of reports
      },
      error: (err) => {
        console.error('Error denying report:', err);
      },
    });
  }


}
