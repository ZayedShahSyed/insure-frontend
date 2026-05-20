import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClaimService } from '../../../services/claim.service';
import { ClaimResponse, ClaimReviewRequest } from '../../../models';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-admin-claims',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent, LoadingSpinnerComponent],
  template: `
    <div class="page-header">
      <h1>Claims Management</h1>
      <p>Review, approve, or reject insurance claims</p>
    </div>

    <div class="filters">
      <button *ngFor="let s of statuses" [class.active]="filter === s" (click)="filterBy(s)">
        {{ s === 'ALL' ? '📋 All' : s === 'PENDING' ? '⏳ Pending' : s === 'UNDER_REVIEW' ? '🔍 Under Review' : s === 'APPROVED' ? '✅ Approved' : '❌ Rejected' }}
      </button>
    </div>

    <app-loading-spinner *ngIf="loading"></app-loading-spinner>

    <div *ngIf="!loading">
      <div class="summary" *ngIf="claims.length > 0">
        <span class="count">{{ claims.length }} claim(s)</span>
      </div>

      <table *ngIf="claims.length > 0">
        <thead><tr><th>Claim #</th><th>Customer</th><th>Policy</th><th>Type</th><th>Hospital</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          <tr *ngFor="let c of claims">
            <td class="mono">{{ c.claimNumber }}</td>
            <td><strong>{{ c.customerName }}</strong><br><span class="sub">{{ c.customerEmail }}</span></td>
            <td>{{ c.policyName }}</td>
            <td>{{ c.claimType }}</td>
            <td>{{ c.hospitalName }}</td>
            <td class="amount">₹{{ c.claimedAmount | number }}</td>
            <td><app-status-badge [status]="c.status"></app-status-badge></td>
            <td>
              <button class="btn-review" *ngIf="c.status === 'PENDING' || c.status === 'UNDER_REVIEW'" (click)="openReview(c)">🔍 Review</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="empty" *ngIf="claims.length === 0">
        <p>No claims found for this filter.</p>
      </div>
    </div>

    <!-- Review Modal -->
    <div class="modal-overlay" *ngIf="reviewing" (click)="reviewing = null">
      <div class="modal" (click)="$event.stopPropagation()">
        <h3>Review Claim</h3>
        <div class="claim-summary">
          <p><strong>{{ reviewing!.claimNumber }}</strong> — {{ reviewing!.customerName }}</p>
          <p>{{ reviewing!.claimType }} | {{ reviewing!.policyName }}</p>
          <p>Hospital: {{ reviewing!.hospitalName }}</p>
          <p>Diagnosis: {{ reviewing!.diagnosis }}</p>
          <p class="claimed">Claimed Amount: <strong>₹{{ reviewing!.claimedAmount | number }}</strong></p>
        </div>

        <div class="form-group">
          <label>Decision</label>
          <select [(ngModel)]="reviewForm.status">
            <option value="UNDER_REVIEW">Mark Under Review</option>
            <option value="APPROVED">Approve</option>
            <option value="REJECTED">Reject</option>
          </select>
        </div>
        <div class="form-group" *ngIf="reviewForm.status === 'APPROVED'">
          <label>Approved Amount (₹)</label>
          <input type="number" [(ngModel)]="reviewForm.approvedAmount" />
        </div>
        <div class="form-group" *ngIf="reviewForm.status === 'REJECTED'">
          <label>Rejection Remarks</label>
          <textarea [(ngModel)]="reviewForm.adminRemarks" rows="3" placeholder="Reason for rejection..."></textarea>
        </div>
        <div class="modal-actions">
          <button class="btn-submit" (click)="submitReview()">Submit Review</button>
          <button class="btn-cancel-modal" (click)="reviewing = null">Cancel</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 1.5rem; }
    .page-header h1 { margin: 0; font-size: 1.75rem; }
    .page-header p { color: #666; margin-top: 0.25rem; }
    .filters { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .filters button { padding: 0.5rem 1rem; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; background: white; font-size: 0.85rem; transition: all 0.2s; }
    .filters button:hover { border-color: #4f46e5; }
    .filters button.active { background: #4f46e5; color: white; border-color: #4f46e5; }
    .summary { margin-bottom: 0.75rem; }
    .count { font-size: 0.9rem; color: #475569; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    th, td { padding: 0.75rem 0.85rem; text-align: left; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; }
    th { background: #f8fafc; font-weight: 600; font-size: 0.75rem; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
    .mono { font-family: monospace; font-size: 0.8rem; }
    .sub { font-size: 0.75rem; color: #94a3b8; }
    .amount { font-weight: 600; color: #ea580c; }
    .btn-review { padding: 0.35rem 0.7rem; background: #dbeafe; color: #1e40af; border: 1px solid #93c5fd; border-radius: 4px; cursor: pointer; font-size: 0.8rem; }
    .btn-review:hover { background: #2563eb; color: white; }
    .empty { text-align: center; padding: 2rem; color: #666; }
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { background: white; padding: 2rem; border-radius: 12px; width: 100%; max-width: 500px; }
    .modal h3 { margin: 0 0 1rem; font-size: 1.2rem; }
    .claim-summary { background: #f8fafc; padding: 1rem; border-radius: 8px; margin-bottom: 1.25rem; font-size: 0.9rem; }
    .claim-summary p { margin: 0.25rem 0; color: #475569; }
    .claimed { color: #ea580c !important; margin-top: 0.5rem !important; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.3rem; font-weight: 500; font-size: 0.9rem; color: #374151; }
    .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 0.6rem; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.9rem; box-sizing: border-box; }
    .modal-actions { display: flex; gap: 0.5rem; margin-top: 1.25rem; }
    .btn-submit { padding: 0.6rem 1.2rem; background: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; }
    .btn-submit:hover { background: #4338ca; }
    .btn-cancel-modal { padding: 0.6rem 1.2rem; background: #e5e7eb; color: #374151; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; }
  `]
})
export class AdminClaimsComponent implements OnInit {
  claims: ClaimResponse[] = [];
  statuses = ['ALL', 'PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'];
  filter = 'ALL';
  reviewing: ClaimResponse | null = null;
  reviewForm: ClaimReviewRequest = { status: 'UNDER_REVIEW' };
  loading = true;

  constructor(private service: ClaimService, private toast: ToastService) {}

  ngOnInit() { this.loadClaims(); }

  loadClaims() {
    this.loading = true;
    if (this.filter === 'ALL') {
      this.service.getAll().subscribe({
        next: res => { this.claims = res; this.loading = false; },
        error: () => { this.loading = false; }
      });
    } else {
      this.service.getByStatus(this.filter).subscribe({
        next: res => { this.claims = res; this.loading = false; },
        error: () => { this.loading = false; }
      });
    }
  }

  filterBy(status: string) { this.filter = status; this.loadClaims(); }

  openReview(claim: ClaimResponse) {
    this.reviewing = claim;
    this.reviewForm = { status: 'UNDER_REVIEW', approvedAmount: claim.claimedAmount, adminRemarks: '' };
  }

  submitReview() {
    if (this.reviewing) {
      this.service.review(this.reviewing.id, this.reviewForm).subscribe({
        next: () => {
          const action = this.reviewForm.status === 'APPROVED' ? 'approved' : this.reviewForm.status === 'REJECTED' ? 'rejected' : 'updated';
          this.toast.success(`Claim ${action} successfully`);
          this.reviewing = null;
          this.loadClaims();
        },
        error: () => { this.toast.error('Failed to review claim'); }
      });
    }
  }
}

