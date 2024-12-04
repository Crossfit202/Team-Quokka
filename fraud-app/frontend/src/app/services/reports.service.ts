import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private apiUrl = 'http://localhost:3000/reports'; // Base URL for reports
  private annotationsUrl = 'http://localhost:3000/annotations'; // Base URL for annotations

  constructor(private http: HttpClient) { }

  // Fetch all reports
  getReports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Create a new report
  create(reportData: any): Observable<any> {
    return this.http.post(this.apiUrl, reportData);
  }

  // Fetch a single report by ID
  getReportById(reportId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${reportId}`);
  }

  getAssignedReports(userId: number, statuses: string[]): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/assigned/${userId}`, {
      params: { statuses: statuses.join(',') },
    });
  }
  



  // Fetch a report by ticket number
  getReportByTicket(ticketNumber: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ticket/${ticketNumber}`);
  }

  updateReport(reportId: number, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${reportId}`, updatedData);
  }

  updateAnnotation(annotationId: number, updatedData: any): Observable<any> {
    return this.http.put<any>(`${this.annotationsUrl}/${annotationId}`, updatedData);
  }



  // Fetch annotations for a specific report
  getAnnotationsByReportId(reportId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.annotationsUrl}/report/${reportId}`);
  }

  // Create a new annotation
  createAnnotation(annotationData: { annotation_text: string; reportKey: number; userKey: number }): Observable<any> {
    return this.http.post<any>(this.annotationsUrl, annotationData);
  }

  // Delete a report by ID
  deleteReportById(reportId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${reportId}`);
  }

  // Submit for Review
submitReport(reportId: number, userId: number): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/${reportId}/submit-for-review`, { userId });
}


approveReport(reportId: number): Observable<any> {
  console.log(`Sending approve request for report ID: ${reportId}`); // Debug log
  return this.http.put<any>(`${this.apiUrl}/${reportId}/approve`, {});
}



denyReport(reportId: number, currentUserId: number): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/${reportId}/deny`, { currentUserId });
}



}
