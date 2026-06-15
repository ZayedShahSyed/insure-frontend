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

    <div *ngIf="!loading && policy" class="page-wrapper">

      <!-- Hero Header -->
      <div class="hero-header">
        <div class="hero-blob"></div>
        <a routerLink="/customer/policies" class="back-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to Policies
        </a>
        <div class="hero-content">
          <div class="hero-badges">
            <span class="type-badge" [class.family]="policy.policyType === 'FAMILY_FLOATER'">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <ng-container *ngIf="policy.policyType === 'INDIVIDUAL'">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </ng-container>
                <ng-container *ngIf="policy.policyType !== 'INDIVIDUAL'">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
                </ng-container>
              </svg>
              {{ policy.policyType === 'FAMILY_FLOATER' ? 'Family Floater' : 'Individual' }}
            </span>
            <span class="cat-badge">{{ policy.categoryName }}</span>
          </div>
          <h1 class="hero-title">{{ policy.name }}</h1>
          <p class="hero-desc">{{ policy.description }}</p>
        </div>

        <!-- Meta Grid inside hero -->
        <div class="meta-grid">
          <div class="meta-item">
            <div class="meta-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <span class="meta-label">Min Age</span>
            <span class="meta-val">{{ policy.minAge }} yrs</span>
          </div>
          <div class="meta-item">
            <div class="meta-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <span class="meta-label">Max Age</span>
            <span class="meta-val">{{ policy.maxAge }} yrs</span>
          </div>
          <div class="meta-item">
            <div class="meta-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <span class="meta-label">Waiting Period</span>
            <span class="meta-val">{{ policy.waitingPeriodDays }} days</span>
          </div>
          <div class="meta-item">
            <div class="meta-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <span class="meta-label">Policy Type</span>
            <span class="meta-val">{{ policy.policyType === 'FAMILY_FLOATER' ? 'Family' : 'Individual' }}</span>
          </div>
        </div>
      </div>

      <!-- Plans Section -->
      <div class="plans-section">
        <div class="section-title-row">
          <div class="section-title">
            <span class="title-pill"></span>
            Available Plans
          </div>
          <span class="plans-count">{{ plans.length }} plan{{ plans.length !== 1 ? 's' : '' }} available</span>
        </div>

        <div class="plans-grid">
          <div class="plan-card" *ngFor="let plan of plans; let i = index" [style.animation-delay]="i * 0.1 + 's'">

            <div class="plan-card-top">
              <div class="plan-rank">Plan {{ i + 1 }}</div>
              <span class="renewal-badge" *ngIf="plan.renewalAllowed">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                Renewal Allowed
              </span>
            </div>

            <h3 class="plan-name">{{ plan.planName }}</h3>

            <!-- Coverage Highlight -->
            <div class="coverage-highlight">
              <span class="coverage-label">Coverage Amount</span>
              <span class="coverage-amount">₹{{ plan.coverageAmount | number }}</span>
            </div>

            <div class="plan-stats">
              <div class="plan-stat">
                <span class="stat-label">Premium</span>
                <span class="stat-value accent">₹{{ plan.premiumAmount | number }}<small>/yr</small></span>
              </div>
              <div class="plan-stat">
                <span class="stat-label">Premium Basis</span>
                <span class="stat-value">{{ plan.premiumBasis }}</span>
              </div>
              <div class="plan-stat">
                <span class="stat-label">Max Members</span>
                <span class="stat-value">{{ policy.policyType === 'INDIVIDUAL' ? '1 (Self only)' : plan.maxMembers }}</span>
              </div>
              <div class="plan-stat">
                <span class="stat-label">Tenure Options</span>
                <span class="stat-value">{{ plan.tenureOptions.join(', ') }} yr(s)</span>
              </div>
            </div>

            <a [routerLink]="['/customer/enroll', plan.id]" class="enroll-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              Enroll Now
            </a>
          </div>
        </div>

        <!-- No Plans -->
        <div class="empty-plans" *ngIf="plans.length === 0">
          <div class="empty-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <h3>No plans available</h3>
          <p>There are currently no plans available for this policy.</p>
        </div>
      </div>

    </div>
  `,
  styles: [`

    * { box-sizing: border-box; margin: 0; padding: 0; }
    .page-wrapper { display: flex; flex-direction: column; gap: 2rem; font-family: 'Inter', sans-serif; }

    /* ── Hero ── */
    .hero-header {
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%);
      border-radius: 24px; padding: 2rem 2.5rem;
      position: relative; overflow: hidden; color: white;
    }
    .hero-blob {
      position: absolute; width: 350px; height: 350px; border-radius: 50%;
      background: radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%);
      top: -120px; right: -80px; pointer-events: none;
    }
    .back-btn {
      display: inline-flex; align-items: center; gap: 0.4rem;
      background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
      color: #c4b5fd; text-decoration: none; padding: 0.4rem 0.9rem;
      border-radius: 20px; font-family: 'DM Sans', sans-serif;
      font-size: 0.8rem; font-weight: 600; margin-bottom: 1.5rem;
      transition: background 0.2s; position: relative; z-index: 1;
    }
    .back-btn:hover { background: rgba(255,255,255,0.18); }

    .hero-content { position: relative; z-index: 1; margin-bottom: 1.75rem; }
    .hero-badges { display: flex; gap: 0.6rem; margin-bottom: 0.9rem; }
    .type-badge {
      display: inline-flex; align-items: center; gap: 0.3rem;
      padding: 0.3rem 0.8rem; border-radius: 20px;
      font-family: 'DM Sans', sans-serif; font-size: 0.74rem; font-weight: 700;
      background: rgba(167,139,250,0.2); color: #c4b5fd; border: 1px solid rgba(167,139,250,0.3);
    }
    .type-badge.family { background: rgba(244,114,182,0.2); color: #f9a8d4; border-color: rgba(244,114,182,0.3); }
    .cat-badge {
      padding: 0.3rem 0.8rem; border-radius: 20px;
      font-family: 'DM Sans', sans-serif; font-size: 0.74rem; font-weight: 600;
      background: rgba(125,211,252,0.15); color: #7dd3fc; border: 1px solid rgba(125,211,252,0.25);
    }
    .hero-title {
      font-family: 'Poppins', sans-serif; font-size: 2rem; font-weight: 900;
      color: white; letter-spacing: -0.5px; margin-bottom: 0.5rem;
    }
    .hero-desc { font-family: 'Inter', sans-serif; color: #c4b5fd; font-size: 0.92rem; line-height: 1.6; max-width: 600px; }

    /* Meta Grid */
    .meta-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 1rem; position: relative; z-index: 1;
    }
    .meta-item {
      background: rgba(255,255,255,0.08); backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.12); border-radius: 14px;
      padding: 1rem; display: flex; flex-direction: column; gap: 0.4rem;
    }
    .meta-icon {
      width: 32px; height: 32px; border-radius: 9px;
      background: rgba(255,255,255,0.15);
      display: flex; align-items: center; justify-content: center; margin-bottom: 0.2rem;
    }
    .meta-label { font-family: 'Inter', sans-serif; font-size: 0.7rem; color: #a5b4fc; text-transform: uppercase; letter-spacing: 0.5px; }
    .meta-val { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 700; color: white; }

    /* ── Plans Section ── */
    .plans-section { display: flex; flex-direction: column; gap: 1.25rem; }
    .section-title-row { display: flex; justify-content: space-between; align-items: center; }
    .section-title {
      font-family: 'Poppins', sans-serif; font-size: 1.15rem; font-weight: 700;
      color: #0f172a; display: flex; align-items: center; gap: 0.6rem;
    }
    .title-pill { width: 4px; height: 22px; background: linear-gradient(180deg, #4f46e5, #7c3aed); border-radius: 4px; display: inline-block; }
    .plans-count {
      font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600;
      background: #ede9fe; color: #6d28d9; padding: 0.3rem 0.8rem; border-radius: 20px;
    }

    .plans-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }

    /* ── Plan Card ── */
    .plan-card {
      background: white; border-radius: 20px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.07);
      border: 1px solid #f1f5f9; padding: 1.5rem;
      display: flex; flex-direction: column; gap: 1rem;
      transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
      animation: slideUp 0.4s ease both;
    }
    .plan-card:hover { transform: translateY(-5px); box-shadow: 0 14px 32px rgba(79,70,229,0.12); border-color: #c7d2fe; }
    @keyframes slideUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }

    .plan-card-top { display: flex; justify-content: space-between; align-items: center; }
    .plan-rank {
      font-family: 'DM Sans', sans-serif; font-size: 0.72rem; font-weight: 700;
      background: #f0f4ff; color: #4f46e5; padding: 0.28rem 0.7rem;
      border-radius: 20px; text-transform: uppercase; letter-spacing: 0.4px;
    }
    .renewal-badge {
      display: inline-flex; align-items: center; gap: 0.3rem;
      font-family: 'DM Sans', sans-serif; font-size: 0.72rem; font-weight: 600;
      background: #dcfce7; color: #166534; border: 1px solid #bbf7d0;
      padding: 0.28rem 0.7rem; border-radius: 20px;
    }

    .plan-name { font-family: 'Poppins', sans-serif; font-size: 1.1rem; font-weight: 700; color: #0f172a; }

    /* Coverage Highlight */
    .coverage-highlight {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      border-radius: 14px; padding: 1rem 1.25rem;
      display: flex; flex-direction: column; gap: 0.25rem;
    }
    .coverage-label { font-family: 'Inter', sans-serif; font-size: 0.7rem; color: #c4b5fd; text-transform: uppercase; letter-spacing: 0.5px; }
    .coverage-amount { font-family: 'Space Grotesk', sans-serif; font-size: 1.6rem; font-weight: 800; color: white; letter-spacing: -0.5px; }

    /* Plan Stats */
    .plan-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; background: #f8fafc; border-radius: 12px; padding: 1rem; }
    .plan-stat { display: flex; flex-direction: column; gap: 0.2rem; }
    .stat-label { font-family: 'Inter', sans-serif; font-size: 0.68rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.4px; }
    .stat-value { font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 600; color: #334155; }
    .stat-value.accent { font-family: 'Space Grotesk', sans-serif; color: #4f46e5; font-size: 1rem; font-weight: 700; }
    .stat-value small { font-size: 0.7rem; font-weight: 500; color: #94a3b8; }

    /* Enroll Button */
    .enroll-btn {
      display: flex; align-items: center; justify-content: center; gap: 0.5rem;
      padding: 0.8rem; background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: white; text-decoration: none; border-radius: 12px;
      font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 700;
      box-shadow: 0 4px 14px rgba(79,70,229,0.3);
      transition: transform 0.2s, box-shadow 0.2s; margin-top: auto;
    }
    .enroll-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(79,70,229,0.4); }

    /* ── Empty Plans ── */
    .empty-plans {
      text-align: center; padding: 3rem;
      background: white; border-radius: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.06);
    }
    .empty-icon {
      width: 68px; height: 68px; border-radius: 20px;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1.25rem;
      box-shadow: 0 8px 22px rgba(79,70,229,0.3);
    }
    .empty-plans h3 { font-family: 'Poppins', sans-serif; font-size: 1.15rem; font-weight: 700; color: #0f172a; margin-bottom: 0.4rem; }
    .empty-plans p { font-family: 'Inter', sans-serif; color: #94a3b8; font-size: 0.88rem; }
  `]
})
export class PolicyDetailComponent implements OnInit {
  policy: PolicyResponse | null = null;
  plans: PolicyPlanResponse[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private policyService: PolicyService,
    private planService: PolicyPlanService
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.policyService.getById(id).subscribe(res => { this.policy = res; this.loading = false; });
    this.planService.getByPolicy(id).subscribe(res => this.plans = res);
  }
}
