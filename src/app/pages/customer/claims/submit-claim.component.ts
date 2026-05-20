import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClaimService } from '../../../services/claim.service';
import { EnrollmentService } from '../../../services/enrollment.service';
import { ClaimRequest, EnrollmentResponse } from '../../../models';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-submit-claim',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Submit a Claim</h1>
    <form (ngSubmit)="onSubmit()" class="form-section">
      <div class="form-group">
        <label>Enrollment</label>
        <select [(ngModel)]="form.enrollmentId" name="enrollmentId" required>
          <option [ngValue]="0" disabled>-- Select Enrollment --</option>
          <option *ngFor="let e of enrollments" [ngValue]="e.id">{{ e.enrollmentNumber }} - {{ e.policyName }} ({{ e.planName }})</option>
        </select>
        <p class="hint" *ngIf="form.enrollmentId">Claim type will be automatically determined based on the policy category.</p>
      </div>
      <div class="form-group">
        <label>Incident Date</label>
        <input type="date" [(ngModel)]="form.incidentDate" name="incidentDate" required />
      </div>
      <div class="form-group">
        <label>Hospital Name</label>
        <input type="text" [(ngModel)]="form.hospitalName" name="hospitalName" required />
      </div>
      <div class="form-group">
        <label>Diagnosis</label>
        <input type="text" [(ngModel)]="form.diagnosis" name="diagnosis" required />
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea [(ngModel)]="form.description" name="description" rows="3"></textarea>
      </div>
      <div class="form-group">
        <label>Claimed Amount (₹)</label>
        <input type="number" [(ngModel)]="form.claimedAmount" name="claimedAmount" required />
      </div>
      <div class="actions">
        <button type="submit" [disabled]="loading">{{ loading ? 'Submitting...' : 'Submit Claim' }}</button>
      </div>
      <div class="error" *ngIf="error">{{ error }}</div>
    </form>
  `,
  styles: [`
    .form-section { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); max-width: 600px; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.25rem; font-weight: 500; }
    .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    .hint { font-size: 0.8rem; color: #4f46e5; margin-top: 0.25rem; }
    .actions button { padding: 0.75rem 1.5rem; background: #4f46e5; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; }
    .actions button:disabled { opacity: 0.6; }
    .error { color: #dc2626; margin-top: 0.5rem; }
  `]
})
export class SubmitClaimComponent implements OnInit {
  enrollments: EnrollmentResponse[] = [];
  form: ClaimRequest = { enrollmentId: 0, claimType: '', incidentDate: '', hospitalName: '', diagnosis: '', description: '', claimedAmount: 0, documents: {} };
  loading = false;
  error = '';

  constructor(private claimService: ClaimService, private enrollmentService: EnrollmentService, private router: Router, private toast: ToastService) {}

  ngOnInit() {
    this.enrollmentService.getMyEnrollments().subscribe(res => this.enrollments = res.filter(e => e.status === 'ACTIVE'));
  }

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.claimService.submit(this.form).subscribe({
      next: () => { this.loading = false; this.toast.success('Claim submitted successfully!'); this.router.navigate(['/customer/claims']); },
      error: (err) => { this.loading = false; this.error = err.error?.message || 'Submission failed'; this.toast.error(this.error); }
    });
  }
}

