import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../services/reports.service';
import { AuthService } from '../services/auth.service';
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
  reports: any[] = []; // All reports
  currentReport: any | null = null; // Currently selected report
  currentAnnotations: any[] = []; // Annotations for the current report
  newAnnotation: string = ''; // New annotation content

  constructor(private reportsService: ReportsService, private authService: AuthService) { }

  ngOnInit() {
    this.fetchReports(); // Fetch reports on component initialization
  }

  // Fetch all reports
  fetchReports() {
    this.reportsService.getReports().subscribe({
      next: (data) => {
        console.log('Fetched Reports:', data); // Log fetched reports
        this.reports = data; // Assign the fetched reports
        if (this.reports.length > 0) {
          this.selectReport(this.reports[0]); // Select the first report by default
        }
      },
      error: (err) => {
        console.error('Error fetching reports:', err); // Log errors
      },
    });
  }


  // Select a report and fetch its annotations
  selectReport(report: any): void {
    this.currentReport = report;

    // Fetch annotations for the selected report
    this.reportsService.getAnnotationsByReportId(report.report_id).subscribe({
      next: (annotations) => {
        this.currentAnnotations = annotations;
      },
      error: (err) => console.error('Error fetching annotations:', err),
    });
  }

  // Add a new annotation
  addAnnotation() {
    if (this.newAnnotation.trim() && this.currentReport) {
      const annotationData = {
        annotation_text: this.newAnnotation,
        created_at: new Date().toISOString(),
        reportKey: this.currentReport.report_id,
        userKey: this.authService.getCurrentUserId()
      };
      console.log('Annotation Data:', annotationData);

      this.reportsService.createAnnotation(annotationData).subscribe({
        next: (newAnnotation) => {
          this.currentAnnotations.push(newAnnotation); // Add the new annotation to the list
          this.newAnnotation = ''; // Clear the input
        },
        error: (err) => console.error('Error creating annotation:', err),
      });
    }
  }
}
