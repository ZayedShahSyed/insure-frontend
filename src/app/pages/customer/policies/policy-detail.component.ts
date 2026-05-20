import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PolicyService } from '../../../services/policy.service';
import { PolicyPlanService } from '../../../services/policy-plan.service';
import { PolicyResponse, PolicyPlanResponse } from '../../../models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-policy-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <app-loading-spinner *ngIf="loading"></app-loading-spinner>

    <div *ngIf="!loading && policy">
      <div class="policy-header">
        <h1>{{ policy.name }}</h1>
        <span class="type-badge">{{ policy.policyType === 'FAMILY_FLOATER' ? '👨‍👩‍👧‍👦 Family Floater' : '👤 Individual' }}</span>
      </div>
      <p class="category">{{ policy.categoryName }}</p>
      <p class="description">{{ policy.description }}</p>
      <div class="meta-grid">
        <div class="meta-item"><span class="label">Min Age</span><span class="val">{{ policy.minAge }} yrs</span></div>
        <div class="meta-item"><span class="label">Max Age</span><span class="val">{{ policy.maxAge }} yrs</span></div>
        <div class="meta-item"><span class="label">Waiting Period</span><span class="val">{{ policy.waitingPeriodDays }} days</span></div>
        <div class="meta-item"><span class="label">Type</span><span class="val">{{ policy.policyType }}</span></div>
      </div>

      <h2>Available Plans</h2>
      <div class="plans">
        <div class="plan-card" *ngFor="let plan of plans">
          <div class="plan-header">
            <h3>{{ plan.planName }}</h3>
            <span class="renewal-badge" *ngIf="plan.renewalAllowed">♻️ Renewal</span>
          </div>
          <div class="plan-details">
            <div class="plan-stat"><span class="stat-label">Coverage</span><span class="stat-value highlight">₹{{ plan.coverageAmount | number }}</span></div>
            <div class="plan-stat"><span class="stat-label">Premium</span><span class="stat-value">₹{{ plan.premiumAmount | number }}/yr</span></div>
            <div class="plan-stat"><span class="stat-label">Premium Basis</span><span class="stat-value">{{ plan.premiumBasis }}</span></div>
            <div class="plan-stat"><span class="stat-label">Max Members</span><span class="stat-value">{{ policy.policyType === 'INDIVIDUAL' ? '1 (Self only)' : plan.maxMembers }}</span></div>
            <div class="plan-stat"><span class="stat-label">Tenure Options</span><span class="stat-value">{{ plan.tenureOptions?.join(', ') }} year(s)</span></div>
          </div>
          <a [routerLink]="['/customer/enroll', plan.id]" class="btn">Enroll Now →</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .policy-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
    .policy-header h1 { margin: 0; font-size: 1.75rem; }
    .type-badge { padding: 0.3rem 0.7rem; background: #ede9fe; color: #5b21b6; border-radius: 6px; font-size: 0.85rem; }
    .category { color: #4f46e5; font-weight: 500; margin-bottom: 0.5rem; }
    .description { color: #475569; line-height: 1.6; margin-bottom: 1.5rem; }
    .meta-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; padding: 1.25rem; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); margin-bottom: 2rem; }
    .meta-item { display: flex; flex-direction: column; }
    .meta-item .label { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
    .meta-item .val { font-size: 0.95rem; font-weight: 600; color: #334155; }
    h2 { margin-bottom: 1rem; font-size: 1.3rem; }
    .plans { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
    .plan-card { background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); display: flex; flex-direction: column; }
    .plan-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .plan-header h3 { margin: 0; font-size: 1.1rem; color: #1e293b; }
    .renewal-badge { font-size: 0.75rem; padding: 0.2rem 0.5rem; background: #d1fae5; color: #065f46; border-radius: 4px; }
    .plan-details { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem; padding: 1rem; background: #f8fafc; border-radius: 8px; }
    .plan-stat { display: flex; flex-direction: column; }
    .stat-label { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; }
    .stat-value { font-size: 0.9rem; font-weight: 600; color: #334155; }
    .stat-value.highlight { color: #4f46e5; font-size: 1.1rem; }
    .btn { display: inline-block; padding: 0.6rem 1.2rem; background: #4f46e5; color: white; text-decoration: none; border-radius: 8px; text-align: center; transition: background 0.2s; margin-top: auto; }
    .btn:hover { background: #4338ca; }
  `]
})
export class PolicyDetailComponent implements OnInit {
  policy: PolicyResponse | null = null;
  plans: PolicyPlanResponse[] = [];
  loading = true;

  constructor(private route: ActivatedRoute, private policyService: PolicyService, private planService: PolicyPlanService) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.policyService.getById(id).subscribe(res => { this.policy = res; this.loading = false; });
    this.planService.getByPolicy(id).subscribe(res => this.plans = res);
  }
}
