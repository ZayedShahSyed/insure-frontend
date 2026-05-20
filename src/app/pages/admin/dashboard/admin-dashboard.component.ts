import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';
import { AdminDashboardResponse } from '../../../models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <app-loading-spinner *ngIf="loading"></app-loading-spinner>

    <div *ngIf="!loading && data">
      <div class="header">
        <h1>Admin Dashboard</h1>
        <p class="subtitle">Overview of your insurance platform</p>
      </div>

      <div class="section-title">📋 Policies</div>
      <div class="stats">
        <div class="card card-blue"><div class="card-icon">📋</div><h3>{{ data.totalPolicies }}</h3><p>Total Policies</p></div>
        <div class="card card-green"><div class="card-icon">✅</div><h3>{{ data.activePolicies }}</h3><p>Active Policies</p></div>
        <div class="card card-purple"><div class="card-icon">👥</div><h3>{{ data.totalCustomers }}</h3><p>Total Customers</p></div>
      </div>

      <div class="section-title">📝 Enrollments</div>
      <div class="stats">
        <div class="card card-blue"><div class="card-icon">📝</div><h3>{{ data.totalEnrollments }}</h3><p>Total</p></div>
        <div class="card card-green"><div class="card-icon">✅</div><h3>{{ data.activeEnrollments }}</h3><p>Active</p></div>
        <div class="card card-yellow"><div class="card-icon">⏳</div><h3>{{ data.pendingEnrollments }}</h3><p>Pending Approval</p></div>
      </div>

      <div class="section-title">📄 Claims</div>
      <div class="stats">
        <div class="card card-blue"><div class="card-icon">📄</div><h3>{{ data.totalClaims }}</h3><p>Total Claims</p></div>
        <div class="card card-yellow"><div class="card-icon">⏳</div><h3>{{ data.pendingClaims }}</h3><p>Pending</p></div>
        <div class="card card-orange"><div class="card-icon">🔍</div><h3>{{ data.underReviewClaims }}</h3><p>Under Review</p></div>
        <div class="card card-green"><div class="card-icon">👍</div><h3>{{ data.approvedClaimsThisMonth }}</h3><p>Approved (Month)</p></div>
        <div class="card card-red"><div class="card-icon">👎</div><h3>{{ data.rejectedClaimsThisMonth }}</h3><p>Rejected (Month)</p></div>
      </div>

      <div class="quick-actions">
        <a routerLink="/admin/policies" class="action-btn">📋 Manage Policies</a>
        <a routerLink="/admin/enrollments" class="action-btn">📝 Review Enrollments</a>
        <a routerLink="/admin/claims" class="action-btn">📄 Review Claims</a>
      </div>
    </div>
  `,
  styles: [`
    .header { margin-bottom: 1.5rem; }
    .header h1 { margin: 0; font-size: 1.75rem; }
    .subtitle { color: #666; margin-top: 0.25rem; }
    .section-title { font-size: 1rem; font-weight: 600; color: #475569; margin: 1.5rem 0 0.75rem; }
    .stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 1rem; }
    .card { background: white; padding: 1.25rem; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); text-align: center; border-top: 3px solid transparent; transition: transform 0.2s; }
    .card:hover { transform: translateY(-2px); }
    .card-blue { border-top-color: #4f46e5; }
    .card-green { border-top-color: #16a34a; }
    .card-yellow { border-top-color: #eab308; }
    .card-purple { border-top-color: #7c3aed; }
    .card-orange { border-top-color: #ea580c; }
    .card-red { border-top-color: #dc2626; }
    .card-icon { font-size: 1.5rem; margin-bottom: 0.25rem; }
    .card h3 { font-size: 1.75rem; color: #333; margin: 0; }
    .card p { margin: 0.25rem 0 0; color: #666; font-size: 0.8rem; }
    .quick-actions { display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap; }
    .action-btn { padding: 0.7rem 1.2rem; background: white; border: 1px solid #e2e8f0; border-radius: 8px; text-decoration: none; color: #333; font-size: 0.9rem; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    .action-btn:hover { background: #4f46e5; color: white; border-color: #4f46e5; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  data: AdminDashboardResponse | null = null;
  loading = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getAdminDashboard().subscribe({
      next: res => { this.data = res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
