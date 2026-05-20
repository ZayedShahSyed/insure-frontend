import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollmentService } from '../../../services/enrollment.service';
import { EnrollmentResponse } from '../../../models';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-admin-enrollments',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent, LoadingSpinnerComponent, ConfirmDialogComponent],
  template: `
    <div class="page-header">
      <h1>Enrollment Management</h1>
      <p>Review and approve customer enrollments</p>
    </div>

    <app-loading-spinner *ngIf="loading"></app-loading-spinner>

    <div *ngIf="!loading">
      <div class="summary" *ngIf="enrollments.length > 0">
        <span class="count">{{ enrollments.length }} enrollment(s)</span>
        <span class="pending-count" *ngIf="pendingCount > 0">⏳ {{ pendingCount }} pending approval</span>
      </div>

      <table *ngIf="enrollments.length > 0">
        <thead><tr><th>Enrollment #</th><th>Customer</th><th>Policy</th><th>Plan</th><th>Premium</th><th>Tenure</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          <tr *ngFor="let e of enrollments">
            <td class="mono">{{ e.enrollmentNumber }}</td>
            <td><strong>{{ e.customerName }}</strong></td>
            <td>{{ e.policyName }}</td>
            <td>{{ e.planName }}</td>
            <td>₹{{ e.premiumAmount | number }}</td>
            <td>{{ e.tenureYears }} yr</td>
            <td><app-status-badge [status]="e.status"></app-status-badge></td>
            <td class="action-btns">
              <button class="btn-view" (click)="viewDetails(e)">👁️ Details</button>
              <button class="btn-approve" *ngIf="e.status === 'PENDING'" (click)="confirmApprove(e)">✅ Approve</button>
              <button class="btn-cancel" *ngIf="e.status === 'PENDING' || e.status === 'ACTIVE'" (click)="confirmCancelEnrollment(e)">❌ Cancel</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="empty" *ngIf="enrollments.length === 0">
        <p>No enrollments found.</p>
      </div>
    </div>

    <!-- Details Modal -->
    <div class="modal-overlay" *ngIf="detailTarget" (click)="detailTarget = null">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Enrollment Details</h3>
          <button class="close-btn" (click)="detailTarget = null">✕</button>
        </div>

        <div class="detail-section">
          <h4>📋 Enrollment Info</h4>
          <div class="detail-grid">
            <div><span class="label">Enrollment #</span><span class="val mono">{{ detailTarget.enrollmentNumber }}</span></div>
            <div><span class="label">Status</span><app-status-badge [status]="detailTarget.status"></app-status-badge></div>
            <div><span class="label">Policy</span><span class="val">{{ detailTarget.policyName }}</span></div>
            <div><span class="label">Plan</span><span class="val">{{ detailTarget.planName }}</span></div>
            <div><span class="label">Policy Type</span><span class="val">{{ detailTarget.policyType === 'FAMILY_FLOATER' ? 'Family Floater' : 'Individual' }}</span></div>
            <div><span class="label">Coverage</span><span class="val highlight">₹{{ detailTarget.coverageAmount | number }}</span></div>
            <div><span class="label">Premium</span><span class="val">₹{{ detailTarget.premiumAmount | number }}</span></div>
            <div><span class="label">Tenure</span><span class="val">{{ detailTarget.tenureYears }} year(s)</span></div>
            <div><span class="label">Start Date</span><span class="val">{{ detailTarget.startDate || 'Pending Approval' }}</span></div>
            <div><span class="label">End Date</span><span class="val">{{ detailTarget.endDate || 'Pending Approval' }}</span></div>
            <div><span class="label">Applied On</span><span class="val">{{ detailTarget.createdAt | date:'medium' }}</span></div>
            <div><span class="label">Payment</span><app-status-badge [status]="detailTarget.paymentStatus"></app-status-badge></div>
          </div>
        </div>

        <div class="detail-section">
          <h4>👤 Customer Details</h4>
          <div class="detail-grid">
            <div><span class="label">Name</span><span class="val">{{ detailTarget.customerName }}</span></div>
            <div><span class="label">Email</span><span class="val">{{ detailTarget.customerEmail }}</span></div>
            <div><span class="label">Phone</span><span class="val">{{ detailTarget.customerPhone }}</span></div>
          </div>
        </div>

        <div class="detail-section" *ngIf="detailTarget.members && detailTarget.members.length > 0">
          <h4>👥 Members ({{ detailTarget.members.length }})</h4>
          <table class="members-table">
            <thead><tr><th>Name</th><th>Type</th><th>Relationship</th><th>Date of Birth</th><th>Gender</th><th>Phone</th></tr></thead>
            <tbody>
              <tr *ngFor="let m of detailTarget.members">
                <td><strong>{{ m.fullName }}</strong></td>
                <td><span class="type-tag">{{ m.personType }}</span></td>
                <td>{{ m.relationship }}</td>
                <td>{{ m.dateOfBirth }}</td>
                <td>{{ m.gender }}</td>
                <td>{{ m.phone }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="modal-actions" *ngIf="detailTarget.status === 'PENDING'">
          <button class="btn-approve-lg" (click)="detailTarget = null; confirmApprove(detailTarget!)">✅ Approve</button>
          <button class="btn-cancel-lg" (click)="detailTarget = null; confirmCancelEnrollment(detailTarget!)">❌ Cancel</button>
        </div>
      </div>
    </div>

    <app-confirm-dialog
      [visible]="showApproveConfirm"
      title="Approve Enrollment"
      [message]="'Approve enrollment ' + (actionTarget?.enrollmentNumber || '') + ' for ' + (actionTarget?.customerName || '') + '?'"
      confirmText="Approve"
      (confirmed)="doApprove()"
      (cancelled)="showApproveConfirm = false">
    </app-confirm-dialog>

    <app-confirm-dialog
      [visible]="showCancelConfirm"
      title="Cancel Enrollment"
      [message]="'Cancel enrollment ' + (actionTarget?.enrollmentNumber || '') + '? This cannot be undone.'"
      confirmText="Cancel Enrollment"
      (confirmed)="doCancel()"
      (cancelled)="showCancelConfirm = false">
    </app-confirm-dialog>
  `,
  styles: [`
    .page-header { margin-bottom: 1.5rem; }
    .page-header h1 { margin: 0; font-size: 1.75rem; }
    .page-header p { color: #666; margin-top: 0.25rem; }
    .summary { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; }
    .count { font-size: 0.9rem; color: #475569; }
    .pending-count { font-size: 0.85rem; color: #92400e; background: #fef3c7; padding: 0.2rem 0.6rem; border-radius: 12px; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    th, td { padding: 0.75rem 0.85rem; text-align: left; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; }
    th { background: #f8fafc; font-weight: 600; font-size: 0.8rem; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
    .mono { font-family: monospace; font-size: 0.85rem; }
    .action-btns { display: flex; gap: 0.25rem; flex-wrap: wrap; }
    .btn-view { padding: 0.35rem 0.7rem; background: #e0f2fe; color: #0369a1; border: 1px solid #7dd3fc; border-radius: 4px; cursor: pointer; font-size: 0.8rem; }
    .btn-view:hover { background: #0ea5e9; color: white; }
    .btn-approve { padding: 0.35rem 0.7rem; background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; border-radius: 4px; cursor: pointer; font-size: 0.8rem; }
    .btn-approve:hover { background: #16a34a; color: white; }
    .btn-cancel { padding: 0.35rem 0.7rem; background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; border-radius: 4px; cursor: pointer; font-size: 0.8rem; }
    .btn-cancel:hover { background: #dc2626; color: white; }
    .empty { text-align: center; padding: 2rem; color: #666; }

    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { background: white; padding: 2rem; border-radius: 12px; width: 100%; max-width: 700px; max-height: 85vh; overflow-y: auto; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .modal-header h3 { margin: 0; font-size: 1.3rem; }
    .close-btn { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #64748b; padding: 0.25rem 0.5rem; }
    .close-btn:hover { color: #1e293b; }

    .detail-section { margin-bottom: 1.5rem; padding-bottom: 1.25rem; border-bottom: 1px solid #f1f5f9; }
    .detail-section:last-child { border-bottom: none; }
    .detail-section h4 { margin: 0 0 0.75rem; font-size: 1rem; color: #334155; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; }
    .detail-grid > div { display: flex; flex-direction: column; }
    .detail-grid .label { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
    .detail-grid .val { font-size: 0.9rem; font-weight: 500; color: #334155; margin-top: 0.1rem; }
    .detail-grid .highlight { color: #4f46e5; font-weight: 700; font-size: 1rem; }

    .members-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
    .members-table th, .members-table td { padding: 0.5rem 0.6rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
    .members-table th { background: #f8fafc; font-weight: 600; font-size: 0.7rem; text-transform: uppercase; color: #64748b; }
    .type-tag { font-size: 0.7rem; padding: 0.15rem 0.4rem; background: #ede9fe; color: #5b21b6; border-radius: 3px; }

    .modal-actions { display: flex; gap: 0.75rem; margin-top: 1rem; }
    .btn-approve-lg { padding: 0.6rem 1.2rem; background: #16a34a; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; }
    .btn-cancel-lg { padding: 0.6rem 1.2rem; background: #dc2626; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; }
  `]
})
export class AdminEnrollmentsComponent implements OnInit {
  enrollments: EnrollmentResponse[] = [];
  loading = true;
  showApproveConfirm = false;
  showCancelConfirm = false;
  actionTarget: EnrollmentResponse | null = null;
  detailTarget: EnrollmentResponse | null = null;

  get pendingCount() { return this.enrollments.filter(e => e.status === 'PENDING').length; }

  constructor(private service: EnrollmentService, private toast: ToastService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.service.getAll().subscribe({
      next: res => { this.enrollments = res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  viewDetails(e: EnrollmentResponse) { this.detailTarget = e; }

  confirmApprove(e: EnrollmentResponse) { this.actionTarget = e; this.showApproveConfirm = true; }
  confirmCancelEnrollment(e: EnrollmentResponse) { this.actionTarget = e; this.showCancelConfirm = true; }

  doApprove() {
    if (this.actionTarget) {
      this.service.approve(this.actionTarget.id).subscribe({
        next: () => { this.toast.success('Enrollment approved'); this.showApproveConfirm = false; this.load(); },
        error: () => { this.toast.error('Failed to approve'); this.showApproveConfirm = false; }
      });
    }
  }

  doCancel() {
    if (this.actionTarget) {
      this.service.cancel(this.actionTarget.id).subscribe({
        next: () => { this.toast.success('Enrollment cancelled'); this.showCancelConfirm = false; this.load(); },
        error: () => { this.toast.error('Failed to cancel'); this.showCancelConfirm = false; }
      });
    }
  }
}
