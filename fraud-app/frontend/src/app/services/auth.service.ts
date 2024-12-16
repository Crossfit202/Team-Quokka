import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    // private apiUrl = 'https://PangolinLoadBalancer-943882191.us-east-1.elb.amazonaws.com/auth'; // Backend base URL

    private apiUrl = 'http://52.201.241.157:3000/auth'; // Backend base URL
    //testing ci/cd pipeline... again....again

    constructor(private http: HttpClient) { }

    // Authenticate user
    login(credentials: { username: string; password: string }): Observable<any> {
        localStorage.setItem('user', JSON.stringify(credentials));
        return this.http.post(`${this.apiUrl}/login`, credentials);
    }

    // Retrieve the current user ID
    getCurrentUserId(): number {
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const parsedUser = JSON.parse(user);
                return parsedUser.user_id;
            } catch (error) {
                console.error('Error parsing user data from localStorage:', error);
                throw new Error('Error retrieving user data. Please log in again.');
            }
        }
        throw new Error('User not found. Please log in.');
    }
}
