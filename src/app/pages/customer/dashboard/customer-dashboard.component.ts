import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';
import { CustomerDashboardResponse } from '../../../models';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent, LoadingSpinnerComponent],
  template: `
    <app-loading-spinner *ngIf="loading"></app-loading-spinner>

    <div *ngIf="!loading && data">
      <div class="header">
        <h1>Welcome, {{ data.customerName }}!</h1>
        <p class="subtitle">Here's an overview of your insurance portfolio</p>
      </div>

      <div class="stats">
        <div class="card card-blue">
          <div class="card-icon">📋</div>
          <h3>{{ data.totalEnrollments }}</h3>
          <p>Total Enrollments</p>
        </div>
        <div class="card card-green">
          <div class="card-icon">✅</div>
          <h3>{{ data.activeEnrollments }}</h3>
          <p>Active Policies</p>
        </div>
        <div class="card card-yellow">
          <div class="card-icon">⏳</div>
          <h3>{{ data.pendingEnrollments }}</h3>
          <p>Pending</p>
        </div>
        <div class="card card-purple">
          <div class="card-icon">📄</div>
          <h3>{{ data.totalClaims }}</h3>
          <p>Total Claims</p>
        </div>
        <div class="card card-orange">
          <div class="card-icon">🕐</div>
          <h3>{{ data.pendingClaims }}</h3>
          <p>Pending Claims</p>
        </div>
        <div class="card card-teal">
          <div class="card-icon">👍</div>
          <h3>{{ data.approvedClaims }}</h3>
          <p>Approved</p>
        </div>
      </div>

      <div class="quick-actions">
        <a routerLink="/customer/policies" class="action-btn">🔍 Browse Policies</a>
        <a routerLink="/customer/claims/new" class="action-btn">📝 File a Claim</a>
        <a routerLink="/customer/enrollments" class="action-btn">📋 View Enrollments</a>
      </div>

      <div class="section" *ngIf="data.recentEnrollments?.length">
        <div class="section-header">
          <h2>Recent Enrollments</h2>
          <a routerLink="/customer/enrollments" class="view-all">View All →</a>
        </div>
        <div class="list">
          <div class="item" *ngFor="let e of data.recentEnrollments">
            <div class="item-info">
              <strong>{{ e.policyName }}</strong>
              <span class="sub">{{ e.planName }} • {{ e.tenureYears }} yr(s)</span>
            </div>
            <div class="item-right">
              <span class="amount">₹{{ e.premiumAmount | number }}</span>
              <app-status-badge [status]="e.status"></app-status-badge>
            </div>
          </div>
        </div>
      </div>

      <div class="section" *ngIf="data.recentClaims?.length">
        <div class="section-header">
          <h2>Recent Claims</h2>
          <a routerLink="/customer/claims" class="view-all">View All →</a>
        </div>
        <div class="list">
          <div class="item" *ngFor="let c of data.recentClaims">
            <div class="item-info">
              <strong>{{ c.claimNumber }}</strong>
              <span class="sub">{{ c.claimType }} • {{ c.policyName }}</span>
            </div>
            <div class="item-right">
              <span class="amount">₹{{ c.claimedAmount | number }}</span>
              <app-status-badge [status]="c.status"></app-status-badge>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="!data.recentEnrollments?.length && !data.recentClaims?.length">
        <p>🏥 You haven't enrolled in any policy yet.</p>
        <a routerLink="/customer/policies" class="action-btn">Browse Available Policies</a>
      </div>
    </div>
  `,
  styles: [`
    .header { margin-bottom: 2rem; }
    .header h1 { margin: 0; font-size: 1.75rem; }
    .subtitle { color: #666; margin-top: 0.25rem; }
    .stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .card { background: white; padding: 1.25rem; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); text-align: center; border-top: 3px solid transparent; transition: transform 0.2s; }
    .card:hover { transform: translateY(-2px); }
    .card-blue { border-top-color: #4f46e5; }
    .card-green { border-top-color: #16a34a; }
    .card-yellow { border-top-color: #eab308; }
    .card-purple { border-top-color: #7c3aed; }
    .card-orange { border-top-color: #ea580c; }
    .card-teal { border-top-color: #0891b2; }
    .card-icon { font-size: 1.5rem; margin-bottom: 0.25rem; }
    .card h3 { font-size: 1.75rem; color: #333; margin: 0; }
    .card p { margin: 0.25rem 0 0; color: #666; font-size: 0.85rem; }
    .quick-actions { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
    .action-btn { padding: 0.6rem 1.2rem; background: white; border: 1px solid #e2e8f0; border-radius: 8px; text-decoration: none; color: #333; font-size: 0.9rem; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    .action-btn:hover { background: #4f46e5; color: white; border-color: #4f46e5; }
    .section { margin-bottom: 2rem; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
    .section-header h2 { margin: 0; font-size: 1.2rem; }
    .view-all { color: #4f46e5; text-decoration: none; font-size: 0.9rem; }
    .view-all:hover { text-decoration: underline; }
    .list { background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); overflow: hidden; }
    .item { padding: 1rem 1.25rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
    .item:last-child { border-bottom: none; }
    .item-info { display: flex; flex-direction: column; gap: 0.2rem; }
    .item-info strong { font-size: 0.95rem; }
    .sub { font-size: 0.8rem; color: #666; }
    .item-right { display: flex; align-items: center; gap: 0.75rem; }
    .amount { font-weight: 600; color: #333; }
    .empty-state { text-align: center; padding: 3rem; background: white; border-radius: 12px; }
    .empty-state p { font-size: 1.1rem; color: #666; margin-bottom: 1rem; }
  `]
})
export class CustomerDashboardComponent implements OnInit {
  data: CustomerDashboardResponse | null = null;
  loading = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getCustomerDashboard().subscribe({
      next: res => { this.data = res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
