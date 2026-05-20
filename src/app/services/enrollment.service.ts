import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnrollmentRequest, EnrollmentResponse } from '../models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private readonly apiUrl = `${environment.apiUrl}/api/enrollments`;

  constructor(private http: HttpClient) {}

  enroll(request: EnrollmentRequest): Observable<EnrollmentResponse> {
    return this.http.post<EnrollmentResponse>(this.apiUrl, request);
  }

  getMyEnrollments(): Observable<EnrollmentResponse[]> {
    return this.http.get<EnrollmentResponse[]>(`${this.apiUrl}/my`);
  }

  getAll(): Observable<EnrollmentResponse[]> {
    return this.http.get<EnrollmentResponse[]>(`${this.apiUrl}/all`);
  }

  getById(id: number): Observable<EnrollmentResponse> {
    return this.http.get<EnrollmentResponse>(`${this.apiUrl}/${id}`);
  }

  getByPolicy(policyId: number): Observable<EnrollmentResponse[]> {
    return this.http.get<EnrollmentResponse[]>(`${this.apiUrl}/policy/${policyId}`);
  }

  approve(id: number): Observable<EnrollmentResponse> {
    return this.http.put<EnrollmentResponse>(`${this.apiUrl}/${id}/approve`, {});
  }

  cancel(id: number): Observable<EnrollmentResponse> {
    return this.http.put<EnrollmentResponse>(`${this.apiUrl}/${id}/cancel`, {});
  }
}

