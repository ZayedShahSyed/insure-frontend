import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PolicyPlanRequest, PolicyPlanResponse } from '../models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PolicyPlanService {
  private readonly apiUrl = `${environment.apiUrl}/api/policy-plans`;

  constructor(private http: HttpClient) {}

  create(policyId: number, request: PolicyPlanRequest): Observable<PolicyPlanResponse> {
    return this.http.post<PolicyPlanResponse>(`${this.apiUrl}?policyId=${policyId}`, request);
  }

  getById(id: number): Observable<PolicyPlanResponse> {
    return this.http.get<PolicyPlanResponse>(`${this.apiUrl}/${id}`);
  }

  getByPolicy(policyId: number): Observable<PolicyPlanResponse[]> {
    return this.http.get<PolicyPlanResponse[]>(`${this.apiUrl}/policy/${policyId}`);
  }

  update(id: number, request: PolicyPlanRequest): Observable<PolicyPlanResponse> {
    return this.http.put<PolicyPlanResponse>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

