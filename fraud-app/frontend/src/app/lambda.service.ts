import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LambdaService {
  private apiUrl = 'https://o0f5m29n7b.execute-api.us-east-1.amazonaws.com/reporttopdf'; // Replace with your API Gateway URL

  constructor(private http: HttpClient) {}

  callLambda(payload: any): Observable<any> {
    const url = `${this.apiUrl}?report_id=${encodeURIComponent(payload)}`;
    return this.http.get(url, {
      responseType: 'blob',
    });
  }
}
