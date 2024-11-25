import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private apiUrl = 'http://localhost:3000/reports'; // Adjust to match your backend URL

  constructor(private http: HttpClient) { }

  // Create a new report
  create(reportData: any): Observable<any> {
    return this.http.post(this.apiUrl, reportData);
  }
}
