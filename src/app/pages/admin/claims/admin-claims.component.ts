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
    <div class="page-wrapper">

      <div class="page-header">
        <div class="ph-left">
          <div class="ph-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/></svg>
          </div>
          <div>
            <h1 class="ph-title">Claims Management</h1>
            <p class="ph-sub">Review, approve, or reject insurance claims</p>
          </div>
        </div>
        <div *ngIf="claims.length > 0">
          <span class="count-badge">{{ claims.length }} claim{{ claims.length === 1 ? "" : "s" }}</span>
        </div>
      </div>

      <div class="filters-bar">
        <button *ngFor="let s of statuses" [class.active]="filter === s" (click)="filterBy(s)" class="filter-btn">
          {{ s === "ALL" ? "All Claims" : s === "PENDING" ? "Pending" : s === "UNDER_REVIEW" ? "Under Review" : s === "APPROVED" ? "Approved" : "Rejected" }}
        </button>
      </div>

      <app-loading-spinner *ngIf="loading"></app-loading-spinner>

      <div *ngIf="!loading">
        <div class="table-card" *ngIf="claims.length > 0">
          <table>
            <thead>
              <tr>
                <th>Claim #</th><th>Customer</th><th>Policy</th><th>Type</th><th>Hospital</th><th>Amount</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of claims">
                <td><span class="mono-badge">{{ c.claimNumber }}</span></td>
                <td>
                  <div class="customer-cell">
                    <div class="customer-avatar">{{ c.customerName.charAt(0) }}</div>
                    <div>
                      <span class="customer-name">{{ c.customerName }}</span>
                      <span class="customer-email">{{ c.customerEmail }}</span>
                    </div>
                  </div>
                </td>
                <td class="policy-name">{{ c.policyName }}</td>
                <td><span class="type-pill">{{ c.claimType }}</span></td>
                <td class="hospital-name">{{ c.hospitalName }}</td>
                <td class="amount-cell">&#8377;{{ c.claimedAmount | number }}</td>
                <td><app-status-badge [status]="c.status"></app-status-badge></td>
                <td>
                  <button class="btn-review" *ngIf="c.status === 'PENDING' || c.status === 'UNDER_REVIEW'" (click)="openReview(c)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    Review
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="empty-state" *ngIf="claims.length === 0">
          <div class="empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><path d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/></svg>
          </div>
          <h3>No claims found</h3>
          <p>No claims match the selected filter.</p>
        </div>
      </div>

    </div>

    <div class="modal-overlay" *ngIf="reviewing" (click)="reviewing = null">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-header-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <div>
            <h3>Review Claim</h3>
            <p class="modal-sub">{{ reviewing!.claimNumber }}</p>
          </div>
          <button class="close-btn" (click)="reviewing = null">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="claim-summary">
          <div class="cs-row"><span class="cs-label">Customer</span><span class="cs-val">{{ reviewing!.customerName }}</span></div>
          <div class="cs-row"><span class="cs-label">Policy</span><span class="cs-val">{{ reviewing!.policyName }}</span></div>
          <div class="cs-row"><span class="cs-label">Type</span><span class="cs-val">{{ reviewing!.claimType }}</span></div>
          <div class="cs-row"><span class="cs-label">Hospital</span><span class="cs-val">{{ reviewing!.hospitalName }}</span></div>
          <div class="cs-row"><span class="cs-label">Diagnosis</span><span class="cs-val">{{ reviewing!.diagnosis }}</span></div>
          <div class="cs-row highlight-row"><span class="cs-label">Claimed Amount</span><span class="cs-amount">&#8377;{{ reviewing!.claimedAmount | number }}</span></div>
        </div>
        <div class="form-group">
          <label>Decision</label>
          <select [(ngModel)]="reviewForm.status">
            <option value="UNDER_REVIEW">Mark Under Review</option>
            <option value="APPROVED">Approve Claim</option>
            <option value="REJECTED">Reject Claim</option>
          </select>
        </div>
        <div class="form-group" *ngIf="reviewForm.status === 'APPROVED'">
          <label>Approved Amount</label>
          <input type="number" [(ngModel)]="reviewForm.approvedAmount" />
        </div>
        <div class="form-group" *ngIf="reviewForm.status === 'REJECTED'">
          <label>Rejection Remarks</label>
          <textarea [(ngModel)]="reviewForm.adminRemarks" rows="3" placeholder="Reason for rejection..."></textarea>
        </div>
        <div class="modal-actions">
          <button class="btn-submit" [class.approve]="reviewForm.status === 'APPROVED'" [class.reject]="reviewForm.status === 'REJECTED'" (click)="submitReview()">Submit Decision</button>
          <button class="btn-cancel-modal" (click)="reviewing = null">Cancel</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .page-wrapper { display: flex; flex-direction: column; gap: 1.5rem; font-family: "Inter", sans-serif; }
    .page-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
    .ph-left { display: flex; align-items: center; gap: 1rem; }
    .ph-icon { width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, #d97706, #f59e0b); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(217,119,6,0.35); flex-shrink: 0; }
    .ph-title { font-family: "Poppins", sans-serif; font-size: 1.5rem; font-weight: 800; color: #0f172a; letter-spacing: -0.4px; }
    .ph-sub { font-family: "Inter", sans-serif; font-size: 0.85rem; color: #94a3b8; margin-top: 0.15rem; }
    .count-badge { background: linear-gradient(135deg, #fef3c7, #fde68a); color: #92400e; padding: 0.4rem 1rem; border-radius: 20px; font-family: "DM Sans", sans-serif; font-size: 0.82rem; font-weight: 700; border: 1px solid #fcd34d; }
    .filters-bar { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .filter-btn { padding: 0.55rem 1.1rem; border: 1.5px solid #e2e8f0; border-radius: 10px; cursor: pointer; background: white; font-family: "DM Sans", sans-serif; font-size: 0.85rem; font-weight: 600; color: #64748b; transition: all 0.2s; }
    .filter-btn:hover { border-color: #0284c7; color: #0284c7; background: #f0f9ff; }
    .filter-btn.active { background: linear-gradient(135deg, #0284c7, #0ea5e9); color: white; border-color: transparent; box-shadow: 0 4px 12px rgba(2,132,199,0.3); }
    .table-card { background: white; border-radius: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f8fafc; padding: 0.85rem 1rem; text-align: left; font-family: "DM Sans", sans-serif; font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid #f1f5f9; }
    td { padding: 0.9rem 1rem; border-bottom: 1px solid #f8fafc; font-size: 0.88rem; color: #334155; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #fafbff; }
    .mono-badge { font-family: "Space Grotesk", sans-serif; font-size: 0.78rem; font-weight: 700; background: #f0f4ff; color: #4f46e5; padding: 0.2rem 0.5rem; border-radius: 6px; }
    .customer-cell { display: flex; align-items: center; gap: 0.6rem; }
    .customer-avatar { width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg, #d97706, #f59e0b); color: white; font-family: "Poppins", sans-serif; font-weight: 700; font-size: 0.75rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .customer-name { display: block; font-family: "DM Sans", sans-serif; font-weight: 600; font-size: 0.85rem; color: #0f172a; }
    .customer-email { display: block; font-size: 0.75rem; color: #94a3b8; }
    .policy-name { font-weight: 500; color: #0f172a; max-width: 140px; }
    .type-pill { background: #f0f4ff; color: #4f46e5; font-family: "DM Sans", sans-serif; font-size: 0.72rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: 6px; white-space: nowrap; }
    .hospital-name { color: #475569; font-size: 0.83rem; }
    .amount-cell { font-family: "Space Grotesk", sans-serif; font-weight: 700; color: #ea580c; font-size: 0.9rem; }
    .btn-review { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.9rem; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; border-radius: 8px; cursor: pointer; font-family: "DM Sans", sans-serif; font-size: 0.8rem; font-weight: 600; transition: all 0.2s; }
    .btn-review:hover { background: #1d4ed8; color: white; border-color: transparent; }
    .empty-state { text-align: center; padding: 3.5rem 2rem; background: white; border-radius: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
    .empty-icon { width: 68px; height: 68px; border-radius: 20px; background: linear-gradient(135deg, #d97706, #f59e0b); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; box-shadow: 0 8px 24px rgba(217,119,6,0.3); }
    .empty-state h3 { font-family: "Poppins", sans-serif; font-size: 1.15rem; font-weight: 700; color: #1e293b; margin-bottom: 0.4rem; }
    .empty-state p { font-size: 0.88rem; color: #94a3b8; }
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.55); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { background: white; border-radius: 20px; width: 100%; max-width: 520px; overflow: hidden; box-shadow: 0 24px 60px rgba(0,0,0,0.2); }
    .modal-header { display: flex; align-items: center; gap: 0.9rem; padding: 1.5rem 1.75rem; border-bottom: 1px solid #f1f5f9; background: #fafbff; }
    .modal-header-icon { width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #d97706, #f59e0b); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .modal-header h3 { font-family: "Poppins", sans-serif; font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 0; }
    .modal-sub { font-family: "Space Grotesk", sans-serif; font-size: 0.78rem; color: #94a3b8; margin-top: 0.1rem; }
    .close-btn { margin-left: auto; background: none; border: none; cursor: pointer; color: #94a3b8; padding: 0.25rem; border-radius: 6px; display: flex; align-items: center; }
    .close-btn:hover { background: #f1f5f9; color: #1e293b; }
    .claim-summary { padding: 1.25rem 1.75rem; display: flex; flex-direction: column; gap: 0.55rem; background: #f8fafc; margin: 1rem 1.75rem; border-radius: 12px; }
    .cs-row { display: flex; justify-content: space-between; align-items: center; }
    .cs-label { font-family: "Inter", sans-serif; font-size: 0.78rem; color: #94a3b8; }
    .cs-val { font-family: "DM Sans", sans-serif; font-size: 0.88rem; font-weight: 600; color: #334155; }
    .highlight-row { padding-top: 0.5rem; margin-top: 0.2rem; border-top: 1px solid #e2e8f0; }
    .cs-amount { font-family: "Space Grotesk", sans-serif; font-size: 1.1rem; font-weight: 800; color: #ea580c; }
    .form-group { padding: 0 1.75rem; margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.4rem; font-family: "DM Sans", sans-serif; font-weight: 600; font-size: 0.85rem; color: #374151; }
    .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 0.65rem 0.85rem; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.9rem; color: #0f172a; font-family: "Inter", sans-serif; transition: border-color 0.2s; }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: #0284c7; }
    .modal-actions { display: flex; gap: 0.75rem; padding: 1.25rem 1.75rem; border-top: 1px solid #f1f5f9; }
    .btn-submit { flex: 1; padding: 0.7rem 1.2rem; background: linear-gradient(135deg, #0284c7, #0ea5e9); color: white; border: none; border-radius: 10px; cursor: pointer; font-family: "DM Sans", sans-serif; font-size: 0.9rem; font-weight: 700; transition: all 0.2s; box-shadow: 0 4px 12px rgba(2,132,199,0.3); }
    .btn-submit:hover { transform: translateY(-1px); }
    .btn-submit.approve { background: linear-gradient(135deg, #059669, #34d399); }
    .btn-submit.reject { background: linear-gradient(135deg, #dc2626, #f87171); }
    .btn-cancel-modal { padding: 0.7rem 1.2rem; background: #f1f5f9; color: #475569; border: none; border-radius: 10px; cursor: pointer; font-family: "DM Sans", sans-serif; font-size: 0.9rem; font-weight: 600; }
    .btn-cancel-modal:hover { background: #e2e8f0; }
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
