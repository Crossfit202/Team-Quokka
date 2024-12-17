import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
    providedIn: 'root',
})
export class AuthService {
    // private apiUrl = 'https://skillsolving.ai/auth'; // Backend base URL
    private apiUrl = 'http://localhost:3000/auth'; // Backend base URL



    constructor(private http: HttpClient) { }

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
