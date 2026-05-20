import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClaimRequest, ClaimResponse, ClaimReviewRequest } from '../models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClaimService {
  private readonly apiUrl = `${environment.apiUrl}/api/claims`;

  constructor(private http: HttpClient) {}

  submit(request: ClaimRequest): Observable<ClaimResponse> {
    return this.http.post<ClaimResponse>(this.apiUrl, request);
  }

  getMyClaims(): Observable<ClaimResponse[]> {
    return this.http.get<ClaimResponse[]>(`${this.apiUrl}/my`);
  }

  getById(id: number): Observable<ClaimResponse> {
    return this.http.get<ClaimResponse>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<ClaimResponse[]> {
    return this.http.get<ClaimResponse[]>(`${this.apiUrl}/all`);
  }

  getByStatus(status: string): Observable<ClaimResponse[]> {
    return this.http.get<ClaimResponse[]>(`${this.apiUrl}/status/${status}`);
  }

  review(id: number, request: ClaimReviewRequest): Observable<ClaimResponse> {
    return this.http.put<ClaimResponse>(`${this.apiUrl}/${id}/review`, request);
  }
}

