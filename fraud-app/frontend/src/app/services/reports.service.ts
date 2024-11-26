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

  // Fetch annotations for a specific report
  getAnnotationsByReportId(reportId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.annotationsUrl}/report/${reportId}`);
  }

  // Create a new annotation
  createAnnotation(annotationData: any): Observable<any> {
    return this.http.post<any>(this.annotationsUrl, annotationData);
  }
}
