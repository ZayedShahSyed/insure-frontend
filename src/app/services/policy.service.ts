import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PolicyRequest, PolicyResponse } from '../models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PolicyService {
  private readonly apiUrl = `${environment.apiUrl}/api/policies`;

  constructor(private http: HttpClient) {}

  create(request: PolicyRequest): Observable<PolicyResponse> {
    return this.http.post<PolicyResponse>(this.apiUrl, request);
  }

  getById(id: number): Observable<PolicyResponse> {
    return this.http.get<PolicyResponse>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<PolicyResponse[]> {
    return this.http.get<PolicyResponse[]>(this.apiUrl);
  }



  getActive(): Observable<PolicyResponse[]> {
    return this.http.get<PolicyResponse[]>(`${this.apiUrl}/active`);
  }


  getMyPolicies(): Observable<PolicyResponse[]> {
    return this.http.get<PolicyResponse[]>(`${this.apiUrl}/my`);
  }

  update(id: number, request: PolicyRequest): Observable<PolicyResponse> {
    return this.http.put<PolicyResponse>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<PolicyResponse> {
    return this.http.delete<PolicyResponse>(`${this.apiUrl}/${id}`);
  }

  reactivate(id: number): Observable<PolicyResponse> {
    return this.http.patch<PolicyResponse>(`${this.apiUrl}/${id}/reactivate`, {});
  }
}
