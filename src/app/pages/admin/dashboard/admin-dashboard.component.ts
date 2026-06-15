import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';
import { AdminDashboardResponse } from '../../../models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
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
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#7dd3fc"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Admin Dashboard
          </span>
          <h1 class="hero-title">
            Platform <span class="hero-name">Overview</span>
            <span class="hero-badge">ADMIN</span>
          </h1>
          <p class="hero-sub">Full control of your insurance platform. Monitor, manage and act.</p>
          <div class="hero-chips">
            <span class="chip blue">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              {{ data.activePolicies }} Active Policies
            </span>
            <span class="chip orange">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {{ data.pendingEnrollments }} Pending Reviews
            </span>
            <span class="chip teal">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              {{ data.totalCustomers }} Customers
            </span>
          </div>
        </div>
        <div class="hero-right">
          <div class="hero-card-float">
            <div class="hcf-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div>
              <span class="hcf-label">Total Policies</span>
              <span class="hcf-value">{{ data.totalPolicies }}</span>
            </div>
            <div class="hcf-dot"></div>
          </div>
          <div class="hero-card-float fc2">
            <div class="hcf-icon orange">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/></svg>
            </div>
            <div>
              <span class="hcf-label">Claims Pending</span>
              <span class="hcf-value">{{ data.pendingClaims }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Stat Cards ── -->
      <div class="stats-grid">
        <div class="stat-card" style="--g1:#0284c7;--g2:#38bdf8;--shadow:rgba(2,132,199,0.25)">
          <div class="stat-bg-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.2" opacity="0.15"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
          </div>
          <div class="stat-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <span class="stat-num">{{ data.totalPolicies }}</span>
          <span class="stat-label">Total Policies</span>
          <div class="stat-bar"><div class="stat-fill" style="width:85%"></div></div>
        </div>

        <div class="stat-card" style="--g1:#059669;--g2:#34d399;--shadow:rgba(5,150,105,0.25)">
          <div class="stat-bg-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.2" opacity="0.15"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <div class="stat-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <span class="stat-num">{{ data.activePolicies }}</span>
          <span class="stat-label">Active Policies</span>
          <div class="stat-bar"><div class="stat-fill" style="width:70%"></div></div>
        </div>

        <div class="stat-card" style="--g1:#7c3aed;--g2:#c084fc;--shadow:rgba(124,58,237,0.25)">
          <div class="stat-bg-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.2" opacity="0.15"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          </div>
          <div class="stat-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          </div>
          <span class="stat-num">{{ data.totalCustomers }}</span>
          <span class="stat-label">Total Customers</span>
          <div class="stat-bar"><div class="stat-fill" style="width:60%"></div></div>
        </div>

        <div class="stat-card" style="--g1:#4f46e5;--g2:#818cf8;--shadow:rgba(79,70,229,0.25)">
          <div class="stat-bg-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.2" opacity="0.15"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/></svg>
          </div>
          <div class="stat-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <span class="stat-num">{{ data.totalEnrollments }}</span>
          <span class="stat-label">Total Enrollments</span>
          <div class="stat-bar"><div class="stat-fill" style="width:75%"></div></div>
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
          <div class="stat-bar"><div class="stat-fill" style="width:35%"></div></div>
        </div>

        <div class="stat-card" style="--g1:#ea580c;--g2:#fb923c;--shadow:rgba(234,88,12,0.25)">
          <div class="stat-bg-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.2" opacity="0.15"><path d="M9 14l6-6m-5.5.5h.01m4.99 5h.01"/></svg>
          </div>
          <div class="stat-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/></svg>
          </div>
          <span class="stat-num">{{ data.totalClaims }}</span>
          <span class="stat-label">Total Claims</span>
          <div class="stat-bar"><div class="stat-fill" style="width:55%"></div></div>
        </div>

        <div class="stat-card" style="--g1:#b45309;--g2:#f59e0b;--shadow:rgba(180,83,9,0.25)">
          <div class="stat-bg-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.2" opacity="0.15"><circle cx="12" cy="12" r="10"/></svg>
          </div>
          <div class="stat-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <span class="stat-num">{{ data.pendingClaims }}</span>
          <span class="stat-label">Pending Claims</span>
          <div class="stat-bar"><div class="stat-fill" style="width:30%"></div></div>
        </div>

        <div class="stat-card" style="--g1:#0891b2;--g2:#22d3ee;--shadow:rgba(8,145,178,0.25)">
          <div class="stat-bg-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.2" opacity="0.15"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div class="stat-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <span class="stat-num">{{ data.underReviewClaims }}</span>
          <span class="stat-label">Under Review</span>
          <div class="stat-bar"><div class="stat-fill" style="width:20%"></div></div>
        </div>

        <div class="stat-card" style="--g1:#16a34a;--g2:#4ade80;--shadow:rgba(22,163,74,0.25)">
          <div class="stat-bg-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.2" opacity="0.15"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <div class="stat-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <span class="stat-num">{{ data.approvedClaimsThisMonth }}</span>
          <span class="stat-label">Approved (Month)</span>
          <div class="stat-bar"><div class="stat-fill" style="width:65%"></div></div>
        </div>

        <div class="stat-card" style="--g1:#dc2626;--g2:#f87171;--shadow:rgba(220,38,38,0.25)">
          <div class="stat-bg-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.2" opacity="0.15"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </div>
          <div class="stat-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </div>
          <span class="stat-num">{{ data.rejectedClaimsThisMonth }}</span>
          <span class="stat-label">Rejected (Month)</span>
          <div class="stat-bar"><div class="stat-fill" style="width:15%"></div></div>
        </div>
      </div>

      <!-- ── Quick Actions ── -->
      <div class="actions-section">
        <h2 class="section-title">
          <span class="title-pill"></span>Quick Actions
        </h2>
        <div class="actions-grid">
          <a routerLink="/admin/policies" class="action-card ac-sky">
            <div class="ac-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div class="ac-text">
              <span class="ac-title">Manage Policies</span>
              <span class="ac-sub">Create, edit & deactivate policies</span>
            </div>
            <svg class="ac-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a routerLink="/admin/enrollments" class="action-card ac-violet">
            <div class="ac-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </div>
            <div class="ac-text">
              <span class="ac-title">Review Enrollments</span>
              <span class="ac-sub">Approve or cancel enrollments</span>
            </div>
            <svg class="ac-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a routerLink="/admin/claims" class="action-card ac-amber">
            <div class="ac-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/></svg>
            </div>
            <div class="ac-text">
              <span class="ac-title">Review Claims</span>
              <span class="ac-sub">Approve, reject or investigate</span>
            </div>
            <svg class="ac-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a routerLink="/admin/customers" class="action-card ac-teal">
            <div class="ac-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div class="ac-text">
              <span class="ac-title">View Customers</span>
              <span class="ac-sub">{{ data.totalCustomers }} registered customers</span>
            </div>
            <svg class="ac-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>

        </div>
      </div>

    </div>
  `,
  styles: [`

    * { box-sizing: border-box; margin: 0; padding: 0; }
    .dashboard { display: flex; flex-direction: column; gap: 2rem; font-family: 'Inter', sans-serif; }

    /* ── Hero ── */
    .hero-banner {
      background: linear-gradient(135deg, #020617 0%, #0c1a3a 40%, #0a2251 100%);
      border-radius: 24px; padding: 2.5rem;
      display: flex; justify-content: space-between; align-items: center;
      position: relative; overflow: hidden; min-height: 200px;
    }
    .hero-blob { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; }
    .b1 { width: 260px; height: 260px; background: #0284c7; opacity: 0.35; top: -80px; left: -60px; }
    .b2 { width: 180px; height: 180px; background: #7c3aed; opacity: 0.25; bottom: -60px; right: 200px; }
    .b3 { width: 140px; height: 140px; background: #0891b2; opacity: 0.2; top: 20px; right: 80px; }

    .hero-left { position: relative; z-index: 2; }
    .hero-eyebrow {
      display: inline-flex; align-items: center; gap: 0.4rem;
      background: rgba(255,255,255,0.1); backdrop-filter: blur(8px);
      color: #7dd3fc; font-family: 'DM Sans', sans-serif;
      font-size: 0.75rem; font-weight: 600; letter-spacing: 0.8px;
      text-transform: uppercase; padding: 0.35rem 0.9rem;
      border-radius: 20px; border: 1px solid rgba(125,211,252,0.2); margin-bottom: 1rem;
    }
    .hero-title { font-family: 'Poppins', sans-serif; font-size: 2rem; font-weight: 900; color: white; letter-spacing: -0.5px; line-height: 1.2; margin-bottom: 0.6rem; display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
    .hero-name { background: linear-gradient(90deg, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .hero-badge { font-size: 0.65rem; font-family: 'DM Sans', sans-serif; font-weight: 700; background: linear-gradient(135deg, #0284c7, #0ea5e9); color: white; padding: 0.2rem 0.6rem; border-radius: 6px; letter-spacing: 1px; -webkit-text-fill-color: white; vertical-align: middle; }
    .hero-sub { font-family: 'Inter', sans-serif; color: #93c5fd; font-size: 0.92rem; margin-bottom: 1.4rem; }
    .hero-chips { display: flex; gap: 0.6rem; flex-wrap: wrap; }
    .chip { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.35rem 0.85rem; border-radius: 20px; font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 600; }
    .chip.blue { background: rgba(14,165,233,0.2); color: #7dd3fc; border: 1px solid rgba(125,211,252,0.25); }
    .chip.orange { background: rgba(251,146,60,0.15); color: #fed7aa; border: 1px solid rgba(253,186,116,0.25); }
    .chip.teal { background: rgba(20,184,166,0.15); color: #99f6e4; border: 1px solid rgba(153,246,228,0.25); }

    .hero-right { position: relative; z-index: 2; display: flex; flex-direction: column; gap: 1rem; }
    .hero-card-float { background: rgba(255,255,255,0.08); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 1rem 1.4rem; display: flex; align-items: center; gap: 0.9rem; min-width: 220px; }
    .hcf-icon { width: 42px; height: 42px; border-radius: 12px; background: linear-gradient(135deg, #0284c7, #0ea5e9); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .hcf-icon.orange { background: linear-gradient(135deg, #ea580c, #f97316); }
    .hcf-label { display: block; font-family: 'Inter', sans-serif; font-size: 0.72rem; color: #93c5fd; }
    .hcf-value { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 700; color: white; }
    .hcf-dot { width: 10px; height: 10px; border-radius: 50%; background: #4ade80; margin-left: auto; box-shadow: 0 0 8px #4ade80; animation: pulse 2s infinite; }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }

    /* ── Stats ── */
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(175px, 1fr)); gap: 1.2rem; }
    .stat-card { background: linear-gradient(135deg, var(--g1), var(--g2)); border-radius: 20px; padding: 1.5rem 1.4rem 1.2rem; position: relative; overflow: hidden; box-shadow: 0 8px 24px var(--shadow); transition: transform 0.25s, box-shadow 0.25s; }
    .stat-card:hover { transform: translateY(-5px) scale(1.02); box-shadow: 0 16px 36px var(--shadow); }
    .stat-bg-icon { position: absolute; bottom: -10px; right: -10px; pointer-events: none; }
    .stat-icon-wrap { width: 40px; height: 40px; border-radius: 12px; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; }
    .stat-num { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 2.4rem; font-weight: 800; color: white; line-height: 1; margin-bottom: 0.3rem; letter-spacing: -1px; }
    .stat-label { display: block; font-family: 'DM Sans', sans-serif; font-size: 0.78rem; color: rgba(255,255,255,0.75); font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 1rem; }
    .stat-bar { height: 4px; background: rgba(255,255,255,0.2); border-radius: 4px; overflow: hidden; }
    .stat-fill { height: 100%; background: rgba(255,255,255,0.7); border-radius: 4px; }

    /* ── Actions ── */
    .section-title { font-family: 'Poppins', sans-serif; font-size: 1.1rem; font-weight: 700; color: #0f172a; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.6rem; }
    .title-pill { width: 4px; height: 20px; background: linear-gradient(180deg, #0284c7, #0ea5e9); border-radius: 4px; display: inline-block; }
    .actions-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; }
    .action-card { display: flex; align-items: center; gap: 1rem; padding: 1.2rem 1.4rem; border-radius: 16px; text-decoration: none; transition: transform 0.2s; border: 1px solid transparent; }
    .action-card:hover { transform: translateY(-3px); }
    .action-card:hover .ac-arrow { transform: translateX(4px); opacity: 1; }
    .ac-sky    { background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border-color: #bae6fd; }
    .ac-violet { background: linear-gradient(135deg, #f5f3ff, #ede9fe); border-color: #ddd6fe; }
    .ac-amber  { background: linear-gradient(135deg, #fffbeb, #fef3c7); border-color: #fde68a; }
    .ac-emerald{ background: linear-gradient(135deg, #ecfdf5, #d1fae5); border-color: #a7f3d0; }
    .ac-teal   { background: linear-gradient(135deg, #f0fdfa, #ccfbf1); border-color: #99f6e4; }
    .ac-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .ac-sky    .ac-icon { background: linear-gradient(135deg, #0284c7, #38bdf8); box-shadow: 0 4px 12px rgba(2,132,199,0.35); }
    .ac-violet .ac-icon { background: linear-gradient(135deg, #7c3aed, #a78bfa); box-shadow: 0 4px 12px rgba(124,58,237,0.35); }
    .ac-amber  .ac-icon { background: linear-gradient(135deg, #d97706, #fbbf24); box-shadow: 0 4px 12px rgba(217,119,6,0.35); }
    .ac-emerald .ac-icon { background: linear-gradient(135deg, #059669, #34d399); box-shadow: 0 4px 12px rgba(5,150,105,0.35); }
    .ac-teal   .ac-icon { background: linear-gradient(135deg, #0d9488, #2dd4bf); box-shadow: 0 4px 12px rgba(13,148,136,0.35); }
    .ac-text { flex: 1; }
    .ac-title { display: block; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 700; color: #1e293b; }
    .ac-sub { font-family: 'Inter', sans-serif; font-size: 0.78rem; color: #94a3b8; }
    .ac-arrow { color: #94a3b8; transition: transform 0.2s, opacity 0.2s; opacity: 0.5; }

    @media (max-width: 900px) {
      .hero-right { display: none; }
      .hero-title { font-size: 1.5rem; }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  data: AdminDashboardResponse | null = null;
  loading = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getAdminDashboard().subscribe({
      next: res => { this.data = res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
