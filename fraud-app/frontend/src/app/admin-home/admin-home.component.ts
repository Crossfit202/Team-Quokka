import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../services/reports.service';
import { UserStateService } from '../services/user-state.service'; // Import UserStateService
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdminHomeComponent implements OnInit {
  reports: any[] = [];
  currentReport: any | null = null;
  currentAnnotations: any[] = [];
  newAnnotation: string = '';
  loggedInUser: any = null; // Holds logged-in user data

  constructor(
    private reportsService: ReportsService,
    private userStateService: UserStateService // Inject UserStateService
  ) { }

  ngOnInit() {
    // Fetch logged-in user data
    this.loggedInUser = this.userStateService.getUser();
    console.log('Logged-in user:', this.loggedInUser);

    // Fetch reports
    this.fetchReports();
  }

  fetchReports() {
    this.reportsService.getReports().subscribe({
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

  selectReport(report: any): void {
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
        },
        error: (err) => {
          console.error('Error adding annotation:', err);
          alert('Failed to add annotation!');
        },
      });
    }
  }

}
