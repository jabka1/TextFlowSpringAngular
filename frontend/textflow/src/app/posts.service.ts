import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class PostService {
    private baseUrl = 'http://localhost:8080/posts';

    constructor(private http: HttpClient, private authService: AuthService) {}

    private getAuthHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
    }

    getAllPosts(): Observable<any[]> {
        return this.http.get<any[]>(this.baseUrl, { headers: this.getAuthHeaders() });
    }

    createPost(title: string, content: string): Observable<any> {
        return this.http.post(this.baseUrl + '/create_post', { title, content }, { headers: this.getAuthHeaders() });
    }

    editPost(id: number, title: string, content: string): Observable<any> {
        return this.http.put(this.baseUrl + `/edit_post/${id}`, { title, content }, { headers: this.getAuthHeaders() });
    }

    deletePost(id: number): Observable<any> {
        return this.http.delete(this.baseUrl + `/delete_post/${id}`, { headers: this.getAuthHeaders() });
    }
}
