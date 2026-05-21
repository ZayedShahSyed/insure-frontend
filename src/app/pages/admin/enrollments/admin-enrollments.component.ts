import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EnrollmentService } from "../../../services/enrollment.service";
import { EnrollmentResponse } from "../../../models";
import { StatusBadgeComponent } from "../../../shared/components/status-badge/status-badge.component";
import { LoadingSpinnerComponent } from "../../../shared/components/loading-spinner/loading-spinner.component";
import { ConfirmDialogComponent } from "../../../shared/components/confirm-dialog/confirm-dialog.component";
import { ToastService } from "../../../shared/services/toast.service";

@Component({
  selector: "app-admin-enrollments",
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent, LoadingSpinnerComponent, ConfirmDialogComponent],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div class="ph-left">
          <div class="ph-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div>
            <h1 class="ph-title">Enrollment Management</h1>
            <p class="ph-sub">Review and approve customer enrollments</p>
          </div>
        </div>
        <div class="ph-badges" *ngIf="enrollments.length > 0">
          <span class="count-badge">{{ enrollments.length }} enrollment{{ enrollments.length === 1 ? "" : "s" }}</span>
          <span class="pending-badge" *ngIf="pendingCount > 0">{{ pendingCount }} pending</span>
        </div>
      </div>

      <app-loading-spinner *ngIf="loading"></app-loading-spinner>

      <div *ngIf="!loading">
        <div class="table-card" *ngIf="enrollments.length > 0">
          <table>
            <thead>
              <tr>
                <th>Enrollment #</th><th>Customer</th><th>Policy</th><th>Plan</th><th>Premium</th><th>Tenure</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let e of enrollments">
                <td><span class="mono-badge">{{ e.enrollmentNumber }}</span></td>
                <td>
                  <div class="customer-cell">
                    <div class="customer-avatar">{{ e.customerName.charAt(0) }}</div>
                    <span class="customer-name">{{ e.customerName }}</span>
                  </div>
                </td>
                <td class="policy-name">{{ e.policyName }}</td>
                <td class="plan-name">{{ e.planName }}</td>
                <td class="amount-cell">&#8377;{{ e.premiumAmount | number }}</td>
                <td class="tenure-cell">{{ e.tenureYears }} yr</td>
                <td><app-status-badge [status]="e.status"></app-status-badge></td>
                <td>
                  <div class="action-btns">
                    <button class="btn-view" (click)="viewDetails(e)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      Details
                    </button>
                    <button class="btn-approve" *ngIf="e.status === 'PENDING'" (click)="confirmApprove(e)">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                      Approve
                    </button>
                    <button class="btn-cancel" *ngIf="e.status === 'PENDING' || e.status === 'ACTIVE'" (click)="confirmCancelEnrollment(e)">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="empty-state" *ngIf="enrollments.length === 0">
          <div class="empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          </div>
          <h3>No enrollments found</h3>
          <p>Customer enrollments will appear here once submitted.</p>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <div class="modal-overlay" *ngIf="detailTarget" (click)="detailTarget = null">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-header-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          </div>
          <div>
            <h3>Enrollment Details</h3>
            <p class="modal-sub">{{ detailTarget.enrollmentNumber }}</p>
          </div>
          <button class="close-btn" (click)="detailTarget = null">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="detail-body">
          <div class="detail-section">
            <h4 class="ds-title">Enrollment Info</h4>
            <div class="detail-grid">
              <div><span class="label">Status</span><app-status-badge [status]="detailTarget.status"></app-status-badge></div>
              <div><span class="label">Policy</span><span class="val">{{ detailTarget.policyName }}</span></div>
              <div><span class="label">Plan</span><span class="val">{{ detailTarget.planName }}</span></div>
              <div><span class="label">Type</span><span class="val">{{ detailTarget.policyType === "FAMILY_FLOATER" ? "Family Floater" : "Individual" }}</span></div>
              <div><span class="label">Coverage</span><span class="val highlight">&#8377;{{ detailTarget.coverageAmount | number }}</span></div>
              <div><span class="label">Premium</span><span class="val">&#8377;{{ detailTarget.premiumAmount | number }}</span></div>
              <div><span class="label">Tenure</span><span class="val">{{ detailTarget.tenureYears }} year(s)</span></div>
              <div><span class="label">Payment</span><app-status-badge [status]="detailTarget.paymentStatus"></app-status-badge></div>
              <div><span class="label">Start Date</span><span class="val">{{ detailTarget.startDate || "Pending" }}</span></div>
              <div><span class="label">End Date</span><span class="val">{{ detailTarget.endDate || "Pending" }}</span></div>
              <div><span class="label">Applied On</span><span class="val">{{ detailTarget.createdAt | date:"medium" }}</span></div>
            </div>
          </div>
          <div class="detail-section">
            <h4 class="ds-title">Customer Details</h4>
            <div class="detail-grid">
              <div><span class="label">Name</span><span class="val">{{ detailTarget.customerName }}</span></div>
              <div><span class="label">Email</span><span class="val">{{ detailTarget.customerEmail }}</span></div>
              <div><span class="label">Phone</span><span class="val">{{ detailTarget.customerPhone }}</span></div>
            </div>
          </div>
          <div class="detail-section" *ngIf="detailTarget.members && detailTarget.members.length > 0">
            <h4 class="ds-title">Members ({{ detailTarget.members.length }})</h4>
            <table class="members-table">
              <thead><tr><th>Name</th><th>Type</th><th>Relationship</th><th>DOB</th><th>Gender</th><th>Phone</th></tr></thead>
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
        </div>

        <div class="modal-actions" *ngIf="detailTarget.status === 'PENDING'">
          <button class="btn-approve-lg" (click)="detailTarget = null; confirmApprove(detailTarget!)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            Approve
          </button>
          <button class="btn-cancel-lg" (click)="detailTarget = null; confirmCancelEnrollment(detailTarget!)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Cancel
          </button>
        </div>
      </div>
    </div>

    <app-confirm-dialog [visible]="showApproveConfirm" title="Approve Enrollment"
      [message]="'Approve enrollment ' + (actionTarget?.enrollmentNumber || '') + ' for ' + (actionTarget?.customerName || '') + '?'"
      confirmText="Approve" (confirmed)="doApprove()" (cancelled)="showApproveConfirm = false">
    </app-confirm-dialog>
    <app-confirm-dialog [visible]="showCancelConfirm" title="Cancel Enrollment"
      [message]="'Cancel enrollment ' + (actionTarget?.enrollmentNumber || '') + '? This cannot be undone.'"
      confirmText="Cancel Enrollment" (confirmed)="doCancel()" (cancelled)="showCancelConfirm = false">
    </app-confirm-dialog>
  `,
  styles: [`
    @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@700&display=swap");
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .page-wrapper { display: flex; flex-direction: column; gap: 1.5rem; font-family: "Inter", sans-serif; }
    .page-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
    .ph-left { display: flex; align-items: center; gap: 1rem; }
    .ph-icon { width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, #7c3aed, #a78bfa); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(124,58,237,0.35); flex-shrink: 0; }
    .ph-title { font-family: "Poppins", sans-serif; font-size: 1.5rem; font-weight: 800; color: #0f172a; letter-spacing: -0.4px; }
    .ph-sub { font-family: "Inter", sans-serif; font-size: 0.85rem; color: #94a3b8; margin-top: 0.15rem; }
    .ph-badges { display: flex; gap: 0.5rem; align-items: center; }
    .count-badge { background: #f0f4ff; color: #4f46e5; padding: 0.4rem 1rem; border-radius: 20px; font-family: "DM Sans", sans-serif; font-size: 0.82rem; font-weight: 700; border: 1px solid #c7d2fe; }
    .pending-badge { background: linear-gradient(135deg, #fef3c7, #fde68a); color: #92400e; padding: 0.4rem 1rem; border-radius: 20px; font-family: "DM Sans", sans-serif; font-size: 0.82rem; font-weight: 700; border: 1px solid #fcd34d; }
    .table-card { background: white; border-radius: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f8fafc; padding: 0.85rem 1rem; text-align: left; font-family: "DM Sans", sans-serif; font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid #f1f5f9; }
    td { padding: 0.9rem 1rem; border-bottom: 1px solid #f8fafc; font-size: 0.88rem; color: #334155; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #fafbff; }
    .mono-badge { font-family: "Space Grotesk", sans-serif; font-size: 0.78rem; font-weight: 700; background: #f5f3ff; color: #7c3aed; padding: 0.2rem 0.5rem; border-radius: 6px; }
    .customer-cell { display: flex; align-items: center; gap: 0.6rem; }
    .customer-avatar { width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg, #7c3aed, #a78bfa); color: white; font-family: "Poppins", sans-serif; font-weight: 700; font-size: 0.75rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .customer-name { font-family: "DM Sans", sans-serif; font-weight: 600; font-size: 0.85rem; color: #0f172a; }
    .policy-name { font-weight: 500; color: #0f172a; }
    .plan-name { color: #475569; }
    .amount-cell { font-family: "Space Grotesk", sans-serif; font-weight: 700; color: #7c3aed; font-size: 0.9rem; }
    .tenure-cell { color: #64748b; font-size: 0.85rem; }
    .action-btns { display: flex; gap: 0.35rem; flex-wrap: wrap; }
    .btn-view { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.38rem 0.8rem; background: #f0f9ff; color: #0284c7; border: 1px solid #bae6fd; border-radius: 8px; cursor: pointer; font-family: "DM Sans", sans-serif; font-size: 0.78rem; font-weight: 600; transition: all 0.2s; }
    .btn-view:hover { background: #0284c7; color: white; border-color: transparent; }
    .btn-approve { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.38rem 0.8rem; background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; border-radius: 8px; cursor: pointer; font-family: "DM Sans", sans-serif; font-size: 0.78rem; font-weight: 600; transition: all 0.2s; }
    .btn-approve:hover { background: #059669; color: white; border-color: transparent; }
    .btn-cancel { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.38rem 0.8rem; background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; border-radius: 8px; cursor: pointer; font-family: "DM Sans", sans-serif; font-size: 0.78rem; font-weight: 600; transition: all 0.2s; }
    .btn-cancel:hover { background: #dc2626; color: white; border-color: transparent; }
    .empty-state { text-align: center; padding: 3.5rem 2rem; background: white; border-radius: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
    .empty-icon { width: 68px; height: 68px; border-radius: 20px; background: linear-gradient(135deg, #7c3aed, #a78bfa); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; box-shadow: 0 8px 24px rgba(124,58,237,0.3); }
    .empty-state h3 { font-family: "Poppins", sans-serif; font-size: 1.15rem; font-weight: 700; color: #1e293b; margin-bottom: 0.4rem; }
    .empty-state p { font-size: 0.88rem; color: #94a3b8; }
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.55); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { background: white; border-radius: 20px; width: 100%; max-width: 720px; max-height: 88vh; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 24px 60px rgba(0,0,0,0.2); }
    .modal-header { display: flex; align-items: center; gap: 0.9rem; padding: 1.5rem 1.75rem; border-bottom: 1px solid #f1f5f9; background: #fafbff; flex-shrink: 0; }
    .modal-header-icon { width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #7c3aed, #a78bfa); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .modal-header h3 { font-family: "Poppins", sans-serif; font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 0; }
    .modal-sub { font-family: "Space Grotesk", sans-serif; font-size: 0.78rem; color: #94a3b8; }
    .close-btn { margin-left: auto; background: none; border: none; cursor: pointer; color: #94a3b8; padding: 0.25rem; border-radius: 6px; display: flex; align-items: center; }
    .close-btn:hover { background: #f1f5f9; color: #1e293b; }
    .detail-body { overflow-y: auto; padding: 1.5rem 1.75rem; display: flex; flex-direction: column; gap: 1.5rem; }
    .detail-section { }
    .ds-title { font-family: "Poppins", sans-serif; font-size: 0.9rem; font-weight: 700; color: #0f172a; margin-bottom: 0.85rem; padding-bottom: 0.5rem; border-bottom: 1px solid #f1f5f9; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; }
    .detail-grid > div { display: flex; flex-direction: column; gap: 0.2rem; }
    .label { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; font-family: "Inter", sans-serif; }
    .val { font-size: 0.88rem; font-weight: 500; color: #334155; font-family: "DM Sans", sans-serif; }
    .highlight { color: #7c3aed; font-weight: 700; font-size: 1rem; font-family: "Space Grotesk", sans-serif; }
    .members-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; border-radius: 10px; overflow: hidden; border: 1px solid #f1f5f9; }
    .members-table th { background: #f8fafc; padding: 0.6rem 0.8rem; text-align: left; font-family: "DM Sans", sans-serif; font-size: 0.68rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
    .members-table td { padding: 0.65rem 0.8rem; border-bottom: 1px solid #f8fafc; }
    .type-tag { font-size: 0.68rem; padding: 0.15rem 0.45rem; background: #ede9fe; color: #5b21b6; border-radius: 4px; font-weight: 600; font-family: "DM Sans", sans-serif; }
    .modal-actions { display: flex; gap: 0.75rem; padding: 1.25rem 1.75rem; border-top: 1px solid #f1f5f9; flex-shrink: 0; }
    .btn-approve-lg { display: inline-flex; align-items: center; gap: 0.4rem; flex: 1; justify-content: center; padding: 0.7rem 1.2rem; background: linear-gradient(135deg, #059669, #34d399); color: white; border: none; border-radius: 10px; cursor: pointer; font-family: "DM Sans", sans-serif; font-size: 0.9rem; font-weight: 700; transition: all 0.2s; }
    .btn-approve-lg:hover { transform: translateY(-1px); }
    .btn-cancel-lg { display: inline-flex; align-items: center; gap: 0.4rem; flex: 1; justify-content: center; padding: 0.7rem 1.2rem; background: linear-gradient(135deg, #dc2626, #f87171); color: white; border: none; border-radius: 10px; cursor: pointer; font-family: "DM Sans", sans-serif; font-size: 0.9rem; font-weight: 700; transition: all 0.2s; }
    .btn-cancel-lg:hover { transform: translateY(-1px); }
  `]
})
export class AdminEnrollmentsComponent implements OnInit {
  enrollments: EnrollmentResponse[] = [];
  loading = true;
  showApproveConfirm = false;
  showCancelConfirm = false;
  actionTarget: EnrollmentResponse | null = null;
  detailTarget: EnrollmentResponse | null = null;

  get pendingCount() { return this.enrollments.filter(e => e.status === "PENDING").length; }

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
        next: () => { this.toast.success("Enrollment approved"); this.showApproveConfirm = false; this.load(); },
        error: () => { this.toast.error("Failed to approve"); this.showApproveConfirm = false; }
      });
    }
  }

  doCancel() {
    if (this.actionTarget) {
      this.service.cancel(this.actionTarget.id).subscribe({
        next: () => { this.toast.success("Enrollment cancelled"); this.showCancelConfirm = false; this.load(); },
        error: () => { this.toast.error("Failed to cancel"); this.showCancelConfirm = false; }
      });
    }
  }
}
