import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = 'http://localhost:8080/auth';
    private accountUrl =  'http://localhost:8080/account';
    private tokenKey = 'auth_token';

    constructor(private http: HttpClient) {}

    login(username: string, password: string) {
        return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { username, password })
            .pipe(
                tap(response => this.setToken(response.token))
            );
    }

    register(username: string, password: string, email: string): Observable<{ token: string }> {
        return this.http.post<{ token: string }>(`${this.apiUrl}/register`, { username, password, email }).pipe(
            tap(response => this.setToken(response.token))
        );
    }

    private setToken(token: string) {
        if (token) {
            localStorage.setItem(this.tokenKey, token);
        }
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    private getAuthHeaders(): HttpHeaders {
        const token = this.getToken();
        return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
    }

    getUserProfile(): Observable<any> {
        return this.http.get<any>(`${this.accountUrl}`, { headers: this.getAuthHeaders() });
    }

    updateEmail(newEmail: string): Observable<any> {
        const token = localStorage.getItem('auth_token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.put<any>(`${this.accountUrl}/update-email`, { newEmail }, { headers });
    }

    updatePassword(newPassword: string): Observable<any> {
        const token = localStorage.getItem('auth_token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.put<any>(`${this.accountUrl}/update-password`, { newPassword }, { headers });
    }

    deleteAccount(): Observable<any> {
        const token = localStorage.getItem('auth_token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.delete<any>(`${this.accountUrl}/delete`, { headers }).pipe(
            tap(() => this.logout())
        );
    }
}
