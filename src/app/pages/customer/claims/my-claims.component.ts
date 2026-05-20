import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClaimService } from '../../../services/claim.service';
import { ClaimResponse } from '../../../models';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-my-claims',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent, LoadingSpinnerComponent],
  template: `
    <div class="page-header">
      <div class="header-row">
        <div>
          <h1>My Claims</h1>
          <p>Track and manage your insurance claims</p>
        </div>
        <a routerLink="/customer/claims/new" class="btn-primary">+ Submit New Claim</a>
      </div>
    </div>

    <app-loading-spinner *ngIf="loading"></app-loading-spinner>

    <div *ngIf="!loading">
      <div class="claims-list" *ngIf="claims.length > 0">
        <div class="claim-card" *ngFor="let c of claims">
          <div class="card-top">
            <div class="card-info">
              <h3>{{ c.claimNumber }}</h3>
              <p class="type">{{ c.claimType }} • {{ c.policyName }}</p>
              <p class="date">Incident: {{ c.incidentDate }}</p>
            </div>
            <app-status-badge [status]="c.status"></app-status-badge>
          </div>
          <div class="card-details">
            <div class="detail"><span class="label">Hospital</span><span class="value">{{ c.hospitalName }}</span></div>
            <div class="detail"><span class="label">Diagnosis</span><span class="value">{{ c.diagnosis }}</span></div>
            <div class="detail"><span class="label">Claimed</span><span class="value highlight">₹{{ c.claimedAmount | number }}</span></div>
            <div class="detail" *ngIf="c.approvedAmount"><span class="label">Approved</span><span class="value success">₹{{ c.approvedAmount | number }}</span></div>
          </div>
          <div class="card-remarks" *ngIf="c.adminRemarks">
            <span class="remarks-label">Admin Remarks:</span> {{ c.adminRemarks }}
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="claims.length === 0">
        <p>📄 You haven't submitted any claims yet.</p>
        <a routerLink="/customer/claims/new" class="btn-primary">Submit Your First Claim</a>
      </div>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 1.5rem; }
    .header-row { display: flex; justify-content: space-between; align-items: flex-start; }
    .page-header h1 { margin: 0; font-size: 1.75rem; }
    .page-header p { color: #666; margin-top: 0.25rem; }
    .btn-primary { display: inline-block; padding: 0.6rem 1.2rem; background: #4f46e5; color: white; text-decoration: none; border-radius: 8px; font-size: 0.9rem; }
    .btn-primary:hover { background: #4338ca; }
    .claims-list { display: flex; flex-direction: column; gap: 1rem; }
    .claim-card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
    .card-info h3 { margin: 0; font-size: 1rem; color: #1e293b; font-family: monospace; }
    .card-info .type { color: #4f46e5; font-size: 0.85rem; margin: 0.25rem 0; }
    .card-info .date { font-size: 0.8rem; color: #94a3b8; }
    .card-details { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; padding: 1rem; background: #f8fafc; border-radius: 8px; }
    .detail { display: flex; flex-direction: column; }
    .detail .label { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
    .detail .value { font-size: 0.9rem; font-weight: 500; color: #334155; margin-top: 0.15rem; }
    .detail .highlight { color: #ea580c; font-weight: 700; }
    .detail .success { color: #16a34a; font-weight: 700; }
    .card-remarks { margin-top: 0.75rem; padding: 0.6rem; background: #fef3c7; border-radius: 6px; font-size: 0.85rem; color: #92400e; }
    .remarks-label { font-weight: 600; }
    .empty-state { text-align: center; padding: 3rem; background: white; border-radius: 12px; }
    .empty-state p { font-size: 1.1rem; color: #666; margin-bottom: 1rem; }
  `]
})
export class MyClaimsComponent implements OnInit {
  claims: ClaimResponse[] = [];
  loading = true;

  constructor(private service: ClaimService) {}

  ngOnInit() {
    this.service.getMyClaims().subscribe({
      next: res => { this.claims = res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
