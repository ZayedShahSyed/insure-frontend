import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';
import { CustomerDashboardResponse } from '../../../models';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent, LoadingSpinnerComponent],
  template: `
    <app-loading-spinner *ngIf="loading"></app-loading-spinner>

    <div *ngIf="!loading && data" class="dashboard">

      <!-- ── Hero Banner ── -->
      <div class="hero-banner">
        <div class="hero-blob b1"></div>
        <div class="hero-blob b2"></div>
        <div class="hero-blob b3"></div>
        <div class="hero-left">
          <span class="hero-eyebrow">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#a5f3fc"><circle cx="12" cy="12" r="10"/></svg>
            Dashboard Overview
          </span>
          <h1 class="hero-title">
            Hello, <span class="hero-name">{{ data.customerName }}</span>
            <span class="wave">👋</span>
          </h1>
          <p class="hero-sub">Your health insurance portfolio is looking great. Stay protected!</p>
          <div class="hero-chips">
            <span class="chip green">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              {{ data.activeEnrollments }} Active Plans
            </span>
            <span class="chip yellow">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {{ data.pendingClaims }} Pending Claims
            </span>
          </div>
        </div>
        <div class="hero-right">
          <div class="hero-card-float">
            <div class="hcf-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <span class="hcf-label">Coverage Status</span>
              <span class="hcf-value">Protected</span>
            </div>
            <div class="hcf-dot"></div>
          </div>
          <div class="hero-card-float fc2">
            <div class="hcf-icon orange">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/></svg>
            </div>
            <div>
              <span class="hcf-label">Total Claims</span>
              <span class="hcf-value">{{ data.totalClaims }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Stat Cards ── -->
      <div class="stats-grid">
        <div class="stat-card" style="--g1:#4f46e5;--g2:#818cf8;--shadow:rgba(79,70,229,0.25)">
          <div class="stat-bg-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.2" opacity="0.15"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div class="stat-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <span class="stat-num">{{ data.totalEnrollments }}</span>
          <span class="stat-label">Total Enrollments</span>
          <div class="stat-bar"><div class="stat-fill" style="width:80%"></div></div>
        </div>

        <div class="stat-card" style="--g1:#059669;--g2:#34d399;--shadow:rgba(5,150,105,0.25)">
          <div class="stat-bg-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.2" opacity="0.15"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <div class="stat-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <span class="stat-num">{{ data.activeEnrollments }}</span>
          <span class="stat-label">Active Policies</span>
          <div class="stat-bar"><div class="stat-fill" style="width:65%"></div></div>
        </div>

        <div class="stat-card" style="--g1:#d97706;--g2:#fbbf24;--shadow:rgba(217,119,6,0.25)">
          <div class="stat-bg-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.2" opacity="0.15"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div class="stat-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <span class="stat-num">{{ data.pendingEnrollments }}</span>
          <span class="stat-label">Pending Enrollments</span>
          <div class="stat-bar"><div class="stat-fill" style="width:40%"></div></div>
        </div>

        <div class="stat-card" style="--g1:#7c3aed;--g2:#c084fc;--shadow:rgba(124,58,237,0.25)">
          <div class="stat-bg-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.2" opacity="0.15"><path d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/></svg>
          </div>
          <div class="stat-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/></svg>
          </div>
          <span class="stat-num">{{ data.totalClaims }}</span>
          <span class="stat-label">Total Claims</span>
          <div class="stat-bar"><div class="stat-fill" style="width:55%"></div></div>
        </div>

        <div class="stat-card" style="--g1:#ea580c;--g2:#fb923c;--shadow:rgba(234,88,12,0.25)">
          <div class="stat-bg-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.2" opacity="0.15"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div class="stat-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <span class="stat-num">{{ data.pendingClaims }}</span>
          <span class="stat-label">Pending Claims</span>
          <div class="stat-bar"><div class="stat-fill" style="width:30%"></div></div>
        </div>

        <div class="stat-card" style="--g1:#0891b2;--g2:#22d3ee;--shadow:rgba(8,145,178,0.25)">
          <div class="stat-bg-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.2" opacity="0.15"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div class="stat-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <span class="stat-num">{{ data.approvedClaims }}</span>
          <span class="stat-label">Approved Claims</span>
          <div class="stat-bar"><div class="stat-fill" style="width:70%"></div></div>
        </div>
      </div>

      <!-- ── Quick Actions ── -->
      <div class="actions-section">
        <h2 class="section-title">
          <span class="title-pill"></span>Quick Actions
        </h2>
        <div class="actions-grid">
          <a routerLink="/customer/policies" class="action-card ac-indigo">
            <div class="ac-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <div class="ac-text">
              <span class="ac-title">Browse Policies</span>
              <span class="ac-sub">Explore available plans</span>
            </div>
            <svg class="ac-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a routerLink="/customer/claims/new" class="action-card ac-violet">
            <div class="ac-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
            </div>
            <div class="ac-text">
              <span class="ac-title">File a Claim</span>
              <span class="ac-sub">Submit a new claim request</span>
            </div>
            <svg class="ac-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a routerLink="/customer/enrollments" class="action-card ac-teal">
            <div class="ac-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div class="ac-text">
              <span class="ac-title">View Enrollments</span>
              <span class="ac-sub">Check enrollment status</span>
            </div>
            <svg class="ac-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>

      <!-- ── Bottom Grid: Recent Enrollments + Recent Claims ── -->
      <div class="bottom-grid">

        <!-- Recent Enrollments -->
        <div class="table-card" *ngIf="data.recentEnrollments?.length">
          <div class="table-card-header">
            <div class="tch-left">
              <div class="tch-dot indigo"></div>
              <h2>Recent Enrollments</h2>
            </div>
            <a routerLink="/customer/enrollments" class="view-all-btn">
              View All
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
          <div class="table-list">
            <div class="table-item" *ngFor="let e of data.recentEnrollments; let i = index" [style.animation-delay]="i * 0.07 + 's'">
              <div class="ti-rank">{{ i + 1 }}</div>
              <div class="ti-icon indigo">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div class="ti-info">
                <span class="ti-name">{{ e.policyName }}</span>
                <span class="ti-sub">{{ e.planName }} &bull; {{ e.tenureYears }} yr(s)</span>
              </div>
              <div class="ti-right">
                <span class="ti-amount">₹{{ e.premiumAmount | number }}</span>
                <app-status-badge [status]="e.status"></app-status-badge>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Claims -->
        <div class="table-card" *ngIf="data.recentClaims?.length">
          <div class="table-card-header">
            <div class="tch-left">
              <div class="tch-dot violet"></div>
              <h2>Recent Claims</h2>
            </div>
            <a routerLink="/customer/claims" class="view-all-btn">
              View All
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
          <div class="table-list">
            <div class="table-item" *ngFor="let c of data.recentClaims; let i = index" [style.animation-delay]="i * 0.07 + 's'">
              <div class="ti-rank">{{ i + 1 }}</div>
              <div class="ti-icon violet">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/></svg>
              </div>
              <div class="ti-info">
                <span class="ti-name">{{ c.claimNumber }}</span>
                <span class="ti-sub">{{ c.claimType }} &bull; {{ c.policyName }}</span>
              </div>
              <div class="ti-right">
                <span class="ti-amount">₹{{ c.claimedAmount | number }}</span>
                <app-status-badge [status]="c.status"></app-status-badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Empty State ── -->
      <div class="empty-state" *ngIf="!data.recentEnrollments?.length && !data.recentClaims?.length">
        <div class="empty-glow"></div>
        <div class="empty-icon-wrap">
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <h3>No activity yet</h3>
        <p>You haven't enrolled in any policy. Start exploring available plans!</p>
        <a routerLink="/customer/policies" class="empty-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Browse Available Policies
        </a>
      </div>

    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800;900&family=Inter:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@700;800&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    .dashboard { display: flex; flex-direction: column; gap: 2rem; font-family: 'Inter', sans-serif; }

    /* ════════════════════════════
       HERO BANNER
    ════════════════════════════ */
    .hero-banner {
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%);
      border-radius: 24px;
      padding: 2.5rem 2.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      overflow: hidden;
      min-height: 200px;
    }
    .hero-blob {
      position: absolute; border-radius: 50%;
      filter: blur(60px); pointer-events: none;
    }
    .b1 { width: 260px; height: 260px; background: #6d28d9; opacity: 0.4; top: -80px; left: -60px; }
    .b2 { width: 180px; height: 180px; background: #3b82f6; opacity: 0.3; bottom: -60px; right: 200px; }
    .b3 { width: 140px; height: 140px; background: #ec4899; opacity: 0.2; top: 20px; right: 80px; }

    .hero-left { position: relative; z-index: 2; }
    .hero-eyebrow {
      display: inline-flex; align-items: center; gap: 0.4rem;
      background: rgba(255,255,255,0.12); backdrop-filter: blur(8px);
      color: #a5f3fc; font-family: 'DM Sans', sans-serif;
      font-size: 0.75rem; font-weight: 600; letter-spacing: 0.8px;
      text-transform: uppercase; padding: 0.35rem 0.9rem;
      border-radius: 20px; border: 1px solid rgba(165,243,252,0.2);
      margin-bottom: 1rem; display: inline-flex;
    }
    .hero-title {
      font-family: 'Poppins', sans-serif; font-size: 2rem;
      font-weight: 900; color: white; letter-spacing: -0.5px;
      line-height: 1.2; margin-bottom: 0.6rem;
    }
    .hero-name {
      background: linear-gradient(90deg, #a78bfa, #67e8f9);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .wave { -webkit-text-fill-color: initial; font-style: normal; }
    .hero-sub {
      font-family: 'Inter', sans-serif; color: #c4b5fd;
      font-size: 0.92rem; margin-bottom: 1.4rem; font-weight: 400;
    }
    .hero-chips { display: flex; gap: 0.6rem; flex-wrap: wrap; }
    .chip {
      display: inline-flex; align-items: center; gap: 0.35rem;
      padding: 0.35rem 0.85rem; border-radius: 20px;
      font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 600;
      backdrop-filter: blur(8px);
    }
    .chip.green { background: rgba(16,185,129,0.2); color: #6ee7b7; border: 1px solid rgba(110,231,183,0.25); }
    .chip.yellow { background: rgba(251,191,36,0.15); color: #fde68a; border: 1px solid rgba(253,230,138,0.25); }

    .hero-right { position: relative; z-index: 2; display: flex; flex-direction: column; gap: 1rem; }
    .hero-card-float {
      background: rgba(255,255,255,0.1); backdrop-filter: blur(16px);
      border: 1px solid rgba(255,255,255,0.18); border-radius: 16px;
      padding: 1rem 1.4rem; display: flex; align-items: center; gap: 0.9rem;
      min-width: 220px;
    }
    .hcf-icon {
      width: 42px; height: 42px; border-radius: 12px;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .hcf-icon.orange { background: linear-gradient(135deg, #ea580c, #f97316); }
    .hcf-label { display: block; font-family: 'Inter', sans-serif; font-size: 0.72rem; color: #a5b4fc; }
    .hcf-value { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 700; color: white; }
    .hcf-dot { width: 10px; height: 10px; border-radius: 50%; background: #4ade80; margin-left: auto; box-shadow: 0 0 8px #4ade80; animation: pulse 2s infinite; }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }

    /* ════════════════════════════
       STAT CARDS
    ════════════════════════════ */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
      gap: 1.2rem;
    }
    .stat-card {
      background: linear-gradient(135deg, var(--g1), var(--g2));
      border-radius: 20px;
      padding: 1.5rem 1.4rem 1.2rem;
      position: relative; overflow: hidden;
      box-shadow: 0 8px 24px var(--shadow);
      transition: transform 0.25s, box-shadow 0.25s;
      cursor: default;
    }
    .stat-card:hover { transform: translateY(-5px) scale(1.02); box-shadow: 0 16px 36px var(--shadow); }
    .stat-bg-icon { position: absolute; bottom: -10px; right: -10px; pointer-events: none; }
    .stat-icon-wrap {
      width: 40px; height: 40px; border-radius: 12px;
      background: rgba(255,255,255,0.2); backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 1rem;
    }
    .stat-num {
      display: block; font-family: 'Space Grotesk', sans-serif;
      font-size: 2.4rem; font-weight: 800; color: white; line-height: 1;
      margin-bottom: 0.3rem; letter-spacing: -1px;
    }
    .stat-label {
      display: block; font-family: 'DM Sans', sans-serif;
      font-size: 0.78rem; color: rgba(255,255,255,0.75);
      font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;
      margin-bottom: 1rem;
    }
    .stat-bar { height: 4px; background: rgba(255,255,255,0.2); border-radius: 4px; overflow: hidden; }
    .stat-fill { height: 100%; background: rgba(255,255,255,0.7); border-radius: 4px; transition: width 1s ease; }

    /* ════════════════════════════
       QUICK ACTIONS
    ════════════════════════════ */
    .actions-section { }
    .section-title {
      font-family: 'Poppins', sans-serif; font-size: 1.1rem;
      font-weight: 700; color: #0f172a; margin-bottom: 1rem;
      display: flex; align-items: center; gap: 0.6rem;
    }
    .title-pill { width: 4px; height: 20px; background: linear-gradient(180deg, #4f46e5, #7c3aed); border-radius: 4px; display: inline-block; }

    .actions-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; }
    .action-card {
      display: flex; align-items: center; gap: 1rem;
      padding: 1.2rem 1.4rem; border-radius: 16px;
      text-decoration: none; position: relative; overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
      border: 1px solid transparent;
    }
    .action-card:hover { transform: translateY(-3px); }
    .action-card:hover .ac-arrow { transform: translateX(4px); opacity: 1; }

    .ac-indigo { background: linear-gradient(135deg, #eef2ff, #e0e7ff); border-color: #c7d2fe; }
    .ac-violet { background: linear-gradient(135deg, #f5f3ff, #ede9fe); border-color: #ddd6fe; }
    .ac-teal   { background: linear-gradient(135deg, #ecfeff, #cffafe); border-color: #a5f3fc; }

    .ac-icon {
      width: 48px; height: 48px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .ac-indigo .ac-icon { background: linear-gradient(135deg, #4f46e5, #818cf8); box-shadow: 0 4px 12px rgba(79,70,229,0.35); }
    .ac-violet .ac-icon { background: linear-gradient(135deg, #7c3aed, #a78bfa); box-shadow: 0 4px 12px rgba(124,58,237,0.35); }
    .ac-teal   .ac-icon { background: linear-gradient(135deg, #0891b2, #22d3ee); box-shadow: 0 4px 12px rgba(8,145,178,0.35); }

    .ac-text { flex: 1; }
    .ac-title { display: block; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 700; color: #1e293b; }
    .ac-sub { font-family: 'Inter', sans-serif; font-size: 0.78rem; color: #94a3b8; }
    .ac-arrow { color: #94a3b8; transition: transform 0.2s, opacity 0.2s; opacity: 0.5; }

    /* ════════════════════════════
       BOTTOM GRID
    ════════════════════════════ */
    .bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

    .table-card {
      background: white; border-radius: 20px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
      border: 1px solid #f1f5f9; overflow: hidden;
    }
    .table-card-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 1.2rem 1.5rem; border-bottom: 1px solid #f1f5f9;
      background: #fafbff;
    }
    .tch-left { display: flex; align-items: center; gap: 0.6rem; }
    .tch-dot { width: 10px; height: 10px; border-radius: 50%; }
    .tch-dot.indigo { background: linear-gradient(135deg, #4f46e5, #818cf8); box-shadow: 0 0 8px rgba(79,70,229,0.4); }
    .tch-dot.violet { background: linear-gradient(135deg, #7c3aed, #a78bfa); box-shadow: 0 0 8px rgba(124,58,237,0.4); }
    .table-card-header h2 {
      font-family: 'Poppins', sans-serif; font-size: 0.95rem;
      font-weight: 700; color: #0f172a;
    }
    .view-all-btn {
      display: inline-flex; align-items: center; gap: 0.3rem;
      background: #f0f4ff; color: #4f46e5; padding: 0.35rem 0.9rem;
      border-radius: 20px; text-decoration: none;
      font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 600;
      transition: background 0.2s;
    }
    .view-all-btn:hover { background: #e0e7ff; }

    .table-list { padding: 0.5rem 0; }
    .table-item {
      display: flex; align-items: center; gap: 0.9rem;
      padding: 0.85rem 1.5rem;
      border-bottom: 1px solid #f8fafc;
      transition: background 0.15s;
      animation: slideIn 0.4s ease both;
    }
    .table-item:last-child { border-bottom: none; }
    .table-item:hover { background: #fafbff; }
    @keyframes slideIn { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }

    .ti-rank {
      width: 22px; height: 22px; border-radius: 6px;
      background: #f1f5f9; color: #94a3b8;
      font-family: 'Space Grotesk', sans-serif; font-size: 0.72rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .ti-icon {
      width: 34px; height: 34px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .ti-icon.indigo { background: linear-gradient(135deg, #4f46e5, #818cf8); }
    .ti-icon.violet { background: linear-gradient(135deg, #7c3aed, #a78bfa); }

    .ti-info { flex: 1; display: flex; flex-direction: column; gap: 0.15rem; }
    .ti-name { font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 600; color: #0f172a; }
    .ti-sub { font-family: 'Inter', sans-serif; font-size: 0.74rem; color: #94a3b8; }

    .ti-right { display: flex; align-items: center; gap: 0.6rem; }
    .ti-amount { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 0.88rem; color: #0f172a; white-space: nowrap; }

    /* ════════════════════════════
       EMPTY STATE
    ════════════════════════════ */
    .empty-state {
      text-align: center; padding: 4rem 2rem;
      background: white; border-radius: 24px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
      position: relative; overflow: hidden;
    }
    .empty-glow {
      position: absolute; width: 300px; height: 300px; border-radius: 50%;
      background: radial-gradient(circle, rgba(99,102,241,0.1), transparent 70%);
      top: 50%; left: 50%; transform: translate(-50%, -50%);
    }
    .empty-icon-wrap {
      width: 80px; height: 80px; border-radius: 24px;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1.5rem; box-shadow: 0 12px 30px rgba(79,70,229,0.35);
      position: relative; z-index: 1;
    }
    .empty-state h3 { font-family: 'Poppins', sans-serif; font-size: 1.3rem; font-weight: 800; color: #1e293b; margin-bottom: 0.5rem; position: relative; z-index: 1; }
    .empty-state p { font-family: 'Inter', sans-serif; color: #94a3b8; font-size: 0.9rem; margin-bottom: 1.5rem; position: relative; z-index: 1; }
    .empty-btn {
      display: inline-flex; align-items: center; gap: 0.5rem;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: white; padding: 0.8rem 1.8rem; border-radius: 12px;
      text-decoration: none; font-family: 'DM Sans', sans-serif;
      font-size: 0.9rem; font-weight: 600;
      box-shadow: 0 6px 18px rgba(79,70,229,0.35);
      transition: transform 0.2s; position: relative; z-index: 1;
    }
    .empty-btn:hover { transform: translateY(-2px); }

    /* ════════════════════════════
       RESPONSIVE
    ════════════════════════════ */
    @media (max-width: 900px) {
      .bottom-grid { grid-template-columns: 1fr; }
      .hero-right { display: none; }
      .hero-title { font-size: 1.5rem; }
    }
  `]
})
export class CustomerDashboardComponent implements OnInit {
  data: CustomerDashboardResponse | null = null;
  loading = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getCustomerDashboard().subscribe({
      next: res => { this.data = res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}