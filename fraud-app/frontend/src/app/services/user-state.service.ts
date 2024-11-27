import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root', // Ensures this service is a singleton and available throughout the app
})
export class UserStateService {
    private userData: any = null; // Holds user data in memory

    // Save user data
    setUser(user: any): void {
        this.userData = user;
        localStorage.setItem('loggedInUser', JSON.stringify(user)); // Optional: Store in localStorage
    }

    // Get user data
    getUser(): any {
        if (!this.userData) {
            const storedUser = localStorage.getItem('loggedInUser');
            if (storedUser) {
                this.userData = JSON.parse(storedUser);
            }
        }
        return this.userData;
    }

    // Clear user data
    clearUser(): void {
        this.userData = null;
        localStorage.removeItem('loggedInUser'); // Remove from localStorage
    }
}
