import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service'
import { AuthToken, LoginDto } from '../models/login';

@Injectable({
    providedIn: 'root', // Ensures this service is a singleton and available throughout the app
})
export class UserStateService {
    private apiUrl = 'https://backend.skillsolving.com/users';
    constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    ) { }

    // Authenticate user
    login(username: string, password: string): Observable<AuthToken> {
      let observer = this.http.post<AuthToken>(
          `${this.apiUrl}/login`, new LoginDto(username, password),
      )
      
    //set the authentication cookie
    observer.subscribe((data) => {

      this.cookieService.set('AuthToken', data.access_token)
      UserStateService.authInfoChanged.next(true);
    })

    //allow others to respond to the observer
    return observer
    }
    /*
    * returns the user that is currently logged in from the back end
    * if the user is not authenticated this WILL fail, you have been warned *^*
    * */
    getUser(): Observable<any> {
      const token = this.cookieService.get('AuthToken'); // Replace with your cookie name

      // Set up the authorization header
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.get<any>(`${this.apiUrl}/whoami`, { headers });
    }

    // Clear user data
    clearUser(): void {
      this.cookieService.delete("AuthToken");
      UserStateService.authInfoChanged.next(false);
    }

    static authInfoChanged : Subject<boolean> = new Subject<boolean>();
}
