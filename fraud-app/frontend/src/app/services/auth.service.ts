import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { error } from 'console';
import { response } from 'express';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/auth'; // Adjust backend base URL as needed

    constructor(private http: HttpClient) { }

    // Authenticate user
    login(credentials: { username: string; password: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, credentials)
    }

    saveUserData(userData: any): void {
        localStorage.setItem('user', JSON.stringify(userData));
    }

    // Retrieve the current user ID
    getCurrentUserId() {
        const user = localStorage.getItem('user');
        if (user) {
            return JSON.parse(user).user_id;
        }
    }
}
