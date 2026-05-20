import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EnrollmentService } from '../../../services/enrollment.service';
import { EnrollmentResponse } from '../../../models';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-my-enrollments',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent, LoadingSpinnerComponent, ConfirmDialogComponent],
  template: `
    <div class="page-header">
      <h1>My Enrollments</h1>
      <p>Manage your policy enrollments</p>
    </div>

    <app-loading-spinner *ngIf="loading"></app-loading-spinner>

    <div *ngIf="!loading">
      <div class="enrollments-list" *ngIf="enrollments.length > 0">
        <div class="enrollment-card" *ngFor="let e of enrollments">
          <div class="card-top">
            <div class="card-info">
              <h3>{{ e.policyName }}</h3>
              <p class="plan">{{ e.planName }} • {{ e.tenureYears }} year(s)</p>
              <p class="enrollment-num">{{ e.enrollmentNumber }}</p>
            </div>
            <div class="card-status">
              <app-status-badge [status]="e.status"></app-status-badge>
              <app-status-badge [status]="e.paymentStatus"></app-status-badge>
            </div>
          </div>
          <div class="card-details">
            <div class="detail"><span class="label">Premium</span><span class="value">₹{{ e.premiumAmount | number }}</span></div>
            <div class="detail"><span class="label">Start</span><span class="value">{{ e.startDate || 'Pending' }}</span></div>
            <div class="detail"><span class="label">End</span><span class="value">{{ e.endDate || 'Pending' }}</span></div>
            <div class="detail"><span class="label">Members</span><span class="value">{{ e.members?.length || 0 }}</span></div>
          </div>

          <button class="btn-details" (click)="toggleDetails(e.id)">
            {{ expandedId === e.id ? '▲ Hide Details' : '▼ View Details' }}
          </button>

          <div class="expanded-details" *ngIf="expandedId === e.id">
            <div class="members-section" *ngIf="e.members && e.members.length > 0">
              <h4>👥 Members & Nominees</h4>
              <table class="members-table">
                <thead><tr><th>Name</th><th>Type</th><th>Relationship</th><th>DOB</th><th>Gender</th><th>Phone</th></tr></thead>
                <tbody>
                  <tr *ngFor="let m of e.members">
                    <td>{{ m.fullName }}</td>
                    <td>{{ m.personType }}</td>
                    <td>{{ m.relationship }}</td>
                    <td>{{ m.dateOfBirth }}</td>
                    <td>{{ m.gender }}</td>
                    <td>{{ m.phone }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="extra-info">
              <p *ngIf="e.approvedBy"><strong>Approved By:</strong> {{ e.approvedBy }} on {{ e.approvedAt }}</p>
            </div>
          </div>

          <div class="card-actions" *ngIf="e.status === 'PENDING' || e.status === 'ACTIVE'">
            <button class="btn-cancel" (click)="confirmCancel(e)">Cancel Enrollment</button>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="enrollments.length === 0">
        <p>📋 You have no enrollments yet.</p>
        <a routerLink="/customer/policies" class="btn-primary">Browse Policies</a>
      </div>
    </div>

    <app-confirm-dialog
      [visible]="showConfirm"
      title="Cancel Enrollment"
      message="Are you sure you want to cancel this enrollment? This action cannot be undone."
      confirmText="Yes, Cancel"
      (confirmed)="doCancel()"
      (cancelled)="showConfirm = false">
    </app-confirm-dialog>
  `,
  styles: [`
    .page-header { margin-bottom: 1.5rem; }
    .page-header h1 { margin: 0; font-size: 1.75rem; }
    .page-header p { color: #666; margin-top: 0.25rem; }
    .enrollments-list { display: flex; flex-direction: column; gap: 1rem; }
    .enrollment-card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
    .card-info h3 { margin: 0; font-size: 1.1rem; color: #1e293b; }
    .card-info .plan { color: #4f46e5; font-size: 0.9rem; margin: 0.25rem 0; }
    .card-info .enrollment-num { font-size: 0.8rem; color: #94a3b8; font-family: monospace; }
    .card-status { display: flex; gap: 0.5rem; flex-direction: column; align-items: flex-end; }
    .card-details { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; padding: 1rem; background: #f8fafc; border-radius: 8px; margin-bottom: 1rem; }
    .detail { display: flex; flex-direction: column; }
    .detail .label { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
    .detail .value { font-size: 0.9rem; font-weight: 600; color: #334155; margin-top: 0.15rem; }
    .card-actions { display: flex; gap: 0.5rem; }
    .btn-cancel { padding: 0.5rem 1rem; background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; border-radius: 6px; cursor: pointer; font-size: 0.85rem; transition: all 0.2s; }
    .btn-cancel:hover { background: #dc2626; color: white; }
    .empty-state { text-align: center; padding: 3rem; background: white; border-radius: 12px; }
    .empty-state p { font-size: 1.1rem; color: #666; margin-bottom: 1rem; }
    .btn-primary { display: inline-block; padding: 0.6rem 1.2rem; background: #4f46e5; color: white; text-decoration: none; border-radius: 8px; }
    .btn-details { padding: 0.4rem 0.8rem; background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer; font-size: 0.8rem; margin-bottom: 0.75rem; }
    .btn-details:hover { background: #e2e8f0; }
    .expanded-details { padding: 1rem; background: #f8fafc; border-radius: 8px; margin-bottom: 0.75rem; }
    .expanded-details h4 { margin: 0 0 0.75rem; font-size: 0.95rem; }
    .members-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
    .members-table th, .members-table td { padding: 0.5rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
    .members-table th { background: #f1f5f9; font-weight: 600; font-size: 0.75rem; text-transform: uppercase; color: #64748b; }
    .extra-info { margin-top: 0.75rem; font-size: 0.85rem; color: #475569; }
    .extra-info p { margin: 0.25rem 0; }
  `]
})
export class MyEnrollmentsComponent implements OnInit {
  enrollments: EnrollmentResponse[] = [];
  loading = true;
  showConfirm = false;
  cancelTarget: EnrollmentResponse | null = null;
  expandedId: number | null = null;

  constructor(private service: EnrollmentService, private toast: ToastService) {}

  ngOnInit() { this.load(); }

  toggleDetails(id: number) {
    this.expandedId = this.expandedId === id ? null : id;
  }

  load() {
    this.service.getMyEnrollments().subscribe({
      next: res => { this.enrollments = res.filter(e => e.status !== 'CANCELLED'); this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  confirmCancel(e: EnrollmentResponse) {
    this.cancelTarget = e;
    this.showConfirm = true;
  }

  doCancel() {
    if (this.cancelTarget) {
      this.service.cancel(this.cancelTarget.id).subscribe({
        next: () => { this.toast.success('Enrollment cancelled successfully'); this.showConfirm = false; this.load(); },
        error: () => { this.toast.error('Failed to cancel enrollment'); this.showConfirm = false; }
      });
    }
  }
}
