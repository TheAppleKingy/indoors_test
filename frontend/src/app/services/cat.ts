import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cat } from '../models/cat';

@Injectable({ providedIn: 'root' })
export class CatService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getCats(): Observable<Cat[]> {
    return this.http.get<Cat[]>(`${this.apiUrl}/cats/`);
  }

  getCat(id: number): Observable<Cat> {
    return this.http.get<Cat>(`${this.apiUrl}/cats/${id}/`);
  }

  createCat(cat: Cat): Observable<Cat> {
    return this.http.post<Cat>(`${this.apiUrl}/cats/`, cat);
  }

  updateCat(id: number, cat: Cat): Observable<Cat> {
    return this.http.put<Cat>(`${this.apiUrl}/cats/${id}/`, cat);
  }

  deleteCat(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cats/${id}/`);
  }
}