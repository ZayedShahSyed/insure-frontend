import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PolicyCategoryRequest, PolicyCategoryResponse } from '../models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PolicyCategoryService {
  private readonly apiUrl = `${environment.apiUrl}/api/policy-categories`;

  constructor(private http: HttpClient) {}

  create(request: PolicyCategoryRequest): Observable<PolicyCategoryResponse> {
    return this.http.post<PolicyCategoryResponse>(`${this.apiUrl}/create`, request);
  }

  getById(id: number): Observable<PolicyCategoryResponse> {
    return this.http.get<PolicyCategoryResponse>(`${this.apiUrl}/${id}`);
  }

  getActive(): Observable<PolicyCategoryResponse[]> {
    return this.http.get<PolicyCategoryResponse[]>(`${this.apiUrl}/active`);
  }

  getAll(): Observable<PolicyCategoryResponse[]> {
    return this.http.get<PolicyCategoryResponse[]>(`${this.apiUrl}/all`);
  }

  update(id: number, request: PolicyCategoryRequest): Observable<PolicyCategoryResponse> {
    return this.http.put<PolicyCategoryResponse>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<PolicyCategoryResponse> {
    return this.http.delete<PolicyCategoryResponse>(`${this.apiUrl}/${id}`);
  }

  reactivate(id: number): Observable<PolicyCategoryResponse> {
    return this.http.patch<PolicyCategoryResponse>(`${this.apiUrl}/${id}/reactivate`, {});
  }
}

