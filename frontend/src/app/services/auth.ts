import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private authStatus = new BehaviorSubject<boolean>(this.isLoggedIn());
  
  authStatus$ = this.authStatus.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, { username, password })
      .pipe(tap((res: any) => {
        if (res.token) {
          localStorage.setItem('access_token', res.token);
          localStorage.setItem('username', username);
          this.authStatus.next(true);
        }
      }));
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, user);
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    this.authStatus.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}