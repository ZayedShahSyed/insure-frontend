import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EnrollmentService } from '../../../services/enrollment.service';
import { PolicyPlanService } from '../../../services/policy-plan.service';
import { EnrollmentPersonRequest, PolicyPlanResponse } from '../../../models';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-enroll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Enroll in Plan</h1>
    <div *ngIf="plan" class="plan-info">
      <p><strong>{{ plan.policyName }}</strong> — {{ plan.planName }}</p>
      <p>Coverage: ₹{{ plan.coverageAmount | number }} | Premium: ₹{{ plan.premiumAmount | number }}/yr</p>
      <p class="plan-type">{{ plan.policyType === 'INDIVIDUAL' ? '👤 Individual Plan (1 member only)' : '👨‍👩‍👧‍👦 Family Floater (up to ' + plan.maxMembers + ' members)' }}</p>
    </div>

    <form (ngSubmit)="onSubmit()" class="form-section">
      <div class="form-group">
        <label>Tenure (years)</label>
        <select [(ngModel)]="tenureYears" name="tenure">
          <option *ngFor="let t of plan?.tenureOptions || [1,2,3]" [ngValue]="t">{{ t }} year(s)</option>
        </select>
      </div>

      <h3>{{ isIndividual ? 'Your Details' : 'Members' }}</h3>
      <p class="helper" *ngIf="!isIndividual">You can add up to {{ plan?.maxMembers }} members including yourself.</p>

      <div *ngFor="let member of members; let i = index" class="member-row">
        <input [(ngModel)]="member.fullName" [name]="'name'+i" placeholder="Full Name" required />
        <select [(ngModel)]="member.personType" [name]="'type'+i">
          <option value="MEMBER">Member</option>
          <option value="NOMINEE">Nominee</option>
        </select>
        <select [(ngModel)]="member.relationship" [name]="'rel'+i">
          <option value="SELF">Self</option>
          <option value="SPOUSE" *ngIf="!isIndividual">Spouse</option>
          <option value="CHILD" *ngIf="!isIndividual">Child</option>
          <option value="PARENT" *ngIf="!isIndividual">Parent</option>
          <option value="OTHER" *ngIf="!isIndividual">Other</option>
        </select>
        <input type="date" [(ngModel)]="member.dateOfBirth" [name]="'dob'+i" required />
        <select [(ngModel)]="member.gender" [name]="'gender'+i">
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
        <input [(ngModel)]="member.phone" [name]="'phone'+i" placeholder="Phone" required />
        <button type="button" class="btn-sm btn-danger" (click)="removeMember(i)" *ngIf="!isIndividual && members.length > 1">✕</button>
      </div>

      <button type="button" class="btn-add" (click)="addMember()" *ngIf="!isIndividual && members.length < (plan?.maxMembers || 4)">+ Add Member</button>
      <p class="member-count" *ngIf="!isIndividual">{{ members.length }} / {{ plan?.maxMembers }} members added</p>

      <div class="actions">
        <button type="submit" [disabled]="loading">{{ loading ? 'Enrolling...' : 'Submit Enrollment' }}</button>
      </div>
      <div class="error" *ngIf="error">{{ error }}</div>
    </form>
  `,
  styles: [`
    .plan-info { background: white; padding: 1.25rem; border-radius: 12px; margin-bottom: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .plan-info p { margin: 0.25rem 0; }
    .plan-type { color: #4f46e5; font-weight: 500; margin-top: 0.5rem !important; }
    .form-section { background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.25rem; font-weight: 500; }
    .form-group select { padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 6px; }
    .helper { font-size: 0.85rem; color: #64748b; margin-bottom: 0.75rem; }
    .member-row { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; flex-wrap: wrap; }
    .member-row input, .member-row select { padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 6px; flex: 1; min-width: 100px; }
    .btn-add { padding: 0.5rem 1rem; background: #0284c7; color: white; border: none; border-radius: 6px; cursor: pointer; margin: 0.5rem 0; }
    .member-count { font-size: 0.8rem; color: #64748b; margin-top: 0.25rem; }
    .actions { margin-top: 1.5rem; }
    .actions button { padding: 0.75rem 1.5rem; background: #4f46e5; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; }
    .actions button:disabled { opacity: 0.6; }
    .btn-sm { padding: 0.3rem 0.5rem; border: none; border-radius: 4px; cursor: pointer; color: white; font-size: 0.8rem; }
    .btn-danger { background: #dc2626; }
    .error { color: #dc2626; margin-top: 0.5rem; }
  `]
})
export class EnrollComponent implements OnInit {
  planId = 0;
  plan: PolicyPlanResponse | null = null;
  tenureYears = 1;
  members: EnrollmentPersonRequest[] = [{ fullName: '', personType: 'MEMBER', relationship: 'SELF', dateOfBirth: '', gender: 'MALE', phone: '' }];
  loading = false;
  error = '';

  get isIndividual(): boolean {
    return this.plan?.policyType === 'INDIVIDUAL';
  }

  constructor(private route: ActivatedRoute, private router: Router, private enrollmentService: EnrollmentService, private planService: PolicyPlanService, private toast: ToastService) {}

  ngOnInit() {
    this.planId = +this.route.snapshot.paramMap.get('planId')!;
    this.planService.getById(this.planId).subscribe(res => this.plan = res);
  }

  addMember() {
    if (this.isIndividual) return;
    if (this.plan && this.members.length >= (this.plan.maxMembers || 4)) {
      this.toast.error('Maximum members reached for this plan');
      return;
    }
    this.members.push({ fullName: '', personType: 'MEMBER', relationship: 'OTHER', dateOfBirth: '', gender: 'MALE', phone: '' });
  }

  removeMember(i: number) { 
    this.members.splice(i, 1); 
  }

  onSubmit() {
    this.error = '';

    if (!this.plan) return;

    // 1. Overall Plan Validations
    if (this.isIndividual && this.members.length > 1) {
      this.error = 'Individual plans can only have 1 member.';
      this.toast.error(this.error);
      return;
    }

    if (this.members.length > (this.plan.maxMembers || 4)) {
      this.error = `This plan allows a maximum of ${this.plan.maxMembers} members.`;
      this.toast.error(this.error);
      return;
    }

    // 2. Member Specific Validations
    const phoneRegex = /^(?:\+?91[\-\s]?)?[6789]\d{9}$/;
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let selfCount = 0;

    for (let i = 0; i < this.members.length; i++) {
      const m = this.members[i];
      const memberLabel = this.isIndividual ? 'Your Details' : `Member ${i + 1}`;

      // Check required fields
      if (!m.fullName || !m.dateOfBirth || !m.phone) {
        this.error = `${memberLabel}: Please fill in all required details (name, date of birth, phone).`;
        this.toast.error(this.error);
        return;
      }

      // Check Full Name
      if (!nameRegex.test(m.fullName)) {
        this.error = `${memberLabel}: Full name must be between 2 to 50 characters and contain only letters.`;
        this.toast.error(this.error);
        return;
      }

      // Check Date of Birth
      const dob = new Date(m.dateOfBirth);
      if (dob > today) {
        this.error = `${memberLabel}: Date of birth cannot be in the future.`;
        this.toast.error(this.error);
        return;
      }

      // Check Phone format
      if (!phoneRegex.test(m.phone)) {
        this.error = `${memberLabel}: Please enter a valid Indian mobile number.`;
        this.toast.error(this.error);
        return;
      }

      // Track relationship
      if (m.relationship === 'SELF') {
        selfCount++;
      }
    }

    // 3. Ensure exactly one primary policyholder exists
    if (selfCount === 0) {
      this.error = 'At least one member must be the primary policyholder (Relationship: Self).';
      this.toast.error(this.error);
      return;
    }

    if (selfCount > 1) {
      this.error = 'Only one member can be the primary policyholder (Relationship: Self). Please change relationships for others.';
      this.toast.error(this.error);
      return;
    }

    // 4. Submit Payload
    this.loading = true;
    
    this.enrollmentService.enroll({ 
      policyPlanId: this.planId, 
      tenureYears: this.tenureYears, 
      members: this.members 
    }).subscribe({
      next: () => { 
        this.loading = false; 
        this.toast.success('Enrollment submitted successfully!'); 
        this.router.navigate(['/customer/enrollments']); 
      },
      error: (err) => { 
        this.loading = false; 
        this.error = err.error?.message || 'Enrollment failed'; 
        this.toast.error(this.error); 
      }
    });
  }
}