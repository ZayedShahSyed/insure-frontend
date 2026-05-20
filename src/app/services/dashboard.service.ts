import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminDashboardResponse, CustomerDashboardResponse } from '../models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAdminDashboard(): Observable<AdminDashboardResponse> {
    return this.http.get<AdminDashboardResponse>(`${this.apiUrl}/api/admin/dashboard`);
  }

  getCustomerDashboard(): Observable<CustomerDashboardResponse> {
    return this.http.get<CustomerDashboardResponse>(`${this.apiUrl}/api/customer/dashboard`);
  }
}

