import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PolicyService } from '../../../services/policy.service';
import { PolicyCategoryService } from '../../../services/policy-category.service';
import { PolicyResponse, PolicyCategoryResponse } from '../../../models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-browse-policies',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="page-wrapper">

      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <span class="header-eyebrow">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Explore Plans
          </span>
          <h1>Browse Policies</h1>
          <p>Find the right health insurance plan for you and your family</p>
        </div>
        <div class="header-badge">
          <span class="badge-num">{{ filteredPolicies.length }}</span>
          <span class="badge-label">Plans Available</span>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <div class="search-wrap">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" [(ngModel)]="searchTerm" placeholder="Search policies..." class="search-input" (input)="filterPolicies()" />
        </div>
        <select [(ngModel)]="selectedCategory" (change)="filterPolicies()" class="filter-select">
          <option value="">All Categories</option>
          <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
        </select>
        <select [(ngModel)]="selectedType" (change)="filterPolicies()" class="filter-select">
          <option value="">All Types</option>
          <option value="INDIVIDUAL">Individual</option>
          <option value="FAMILY_FLOATER">Family Floater</option>
        </select>
        <button class="reset-btn" (click)="resetFilters()" *ngIf="searchTerm || selectedCategory || selectedType">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          Clear
        </button>
      </div>

      <app-loading-spinner *ngIf="loading"></app-loading-spinner>

      <!-- Error State -->
      <div class="error-state" *ngIf="hasError && !loading">
        <div class="error-icon-wrap">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h3>Unable to load policies</h3>
        <p>There was a problem fetching the policies. Please try again.</p>
        <button class="retry-btn" (click)="loadPolicies()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          Retry
        </button>
      </div>

      <!-- Grid -->
      <div class="grid" *ngIf="!loading && !hasError">
        <div class="policy-card" *ngFor="let p of filteredPolicies">
          <div class="card-top">
            <div class="card-badges">
              <span class="type-badge" [class.family]="p.policyType === 'FAMILY_FLOATER'">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path *ngIf="p.policyType === 'INDIVIDUAL'" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle *ngIf="p.policyType === 'INDIVIDUAL'" cx="12" cy="7" r="4"/>
                  <path *ngIf="p.policyType !== 'INDIVIDUAL'" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle *ngIf="p.policyType !== 'INDIVIDUAL'" cx="9" cy="7" r="4"/>
                  <path *ngIf="p.policyType !== 'INDIVIDUAL'" d="M23 21v-2a4 4 0 00-3-3.87"/><path *ngIf="p.policyType !== 'INDIVIDUAL'" d="M16 3.13a4 4 0 010 7.75"/>
                </svg>
                {{ p.policyType === 'FAMILY_FLOATER' ? 'Family Floater' : 'Individual' }}
              </span>
              <span class="cat-badge">{{ p.categoryName }}</span>
            </div>
            <div class="card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
          </div>

          <h3 class="card-title">{{ p.name }}</h3>
          <p class="card-desc">{{ p.description }}</p>

          <div class="card-meta">
            <div class="meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span class="meta-label">Age</span>
              <span class="meta-val">{{ p.minAge }}–{{ p.maxAge }} yrs</span>
            </div>
            <div class="meta-divider"></div>
            <div class="meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span class="meta-label">Waiting</span>
              <span class="meta-val">{{ p.waitingPeriodDays }}d</span>
            </div>
          </div>

          <a [routerLink]="[p.id]" class="view-btn">
            View Plans & Enroll
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!loading && !hasError && filteredPolicies.length === 0">
        <div class="empty-icon-wrap">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <h3>No policies found</h3>
        <p>No policies match your current filters. Try adjusting your search.</p>
        <button class="retry-btn" (click)="resetFilters()">Clear Filters</button>
      </div>

    </div>
  `,
  styles: [`

    * { box-sizing: border-box; margin: 0; padding: 0; }
    .page-wrapper { display: flex; flex-direction: column; gap: 1.75rem; font-family: 'Inter', sans-serif; }

    /* ── Header ── */
    .page-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      background: linear-gradient(135deg, #1e1b4b, #312e81, #4c1d95);
      border-radius: 20px; padding: 2rem 2.5rem; color: white; position: relative; overflow: hidden;
    }
    .page-header::before {
      content: ''; position: absolute; width: 300px; height: 300px; border-radius: 50%;
      background: rgba(139,92,246,0.3); filter: blur(80px); top: -100px; right: 100px;
    }
    .header-eyebrow {
      display: inline-flex; align-items: center; gap: 0.4rem;
      background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.15);
      color: #a5f3fc; font-family: 'DM Sans', sans-serif; font-size: 0.72rem;
      font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase;
      padding: 0.3rem 0.8rem; border-radius: 20px; margin-bottom: 0.75rem;
    }
    .header-left h1 {
      font-family: 'Poppins', sans-serif; font-size: 1.8rem; font-weight: 800;
      color: white; letter-spacing: -0.5px; margin-bottom: 0.35rem; position: relative; z-index: 1;
    }
    .header-left p { font-family: 'Inter', sans-serif; color: #c4b5fd; font-size: 0.9rem; position: relative; z-index: 1; }
    .header-badge {
      background: rgba(255,255,255,0.1); backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.18); border-radius: 16px;
      padding: 1rem 1.5rem; text-align: center; position: relative; z-index: 1;
    }
    .badge-num { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 2rem; font-weight: 800; color: white; line-height: 1; }
    .badge-label { font-family: 'Inter', sans-serif; font-size: 0.72rem; color: #a5b4fc; text-transform: uppercase; letter-spacing: 0.5px; }

    /* ── Filters ── */
    .filters-bar {
      display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;
      background: white; padding: 1rem 1.25rem; border-radius: 14px;
      box-shadow: 0 1px 6px rgba(0,0,0,0.06); border: 1px solid #f1f5f9;
    }
    .search-wrap { flex: 1; min-width: 200px; position: relative; display: flex; align-items: center; }
    .search-icon { position: absolute; left: 0.85rem; color: #94a3b8; pointer-events: none; }
    .search-input {
      width: 100%; padding: 0.6rem 1rem 0.6rem 2.4rem;
      border: 1.5px solid #e2e8f0; border-radius: 10px;
      font-family: 'Inter', sans-serif; font-size: 0.88rem; color: #334155;
      outline: none; transition: border-color 0.2s;
    }
    .search-input:focus { border-color: #4f46e5; }
    .filter-select {
      padding: 0.6rem 1rem; border: 1.5px solid #e2e8f0; border-radius: 10px;
      font-family: 'Inter', sans-serif; font-size: 0.88rem; color: #334155;
      background: white; outline: none; cursor: pointer; transition: border-color 0.2s;
    }
    .filter-select:focus { border-color: #4f46e5; }
    .reset-btn {
      display: flex; align-items: center; gap: 0.4rem;
      padding: 0.6rem 1rem; background: #fee2e2; color: #dc2626;
      border: 1px solid #fecaca; border-radius: 10px; cursor: pointer;
      font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600;
      transition: background 0.2s;
    }
    .reset-btn:hover { background: #fecaca; }

    /* ── Grid ── */
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 1.5rem; }

    /* ── Policy Card ── */
    .policy-card {
      background: white; border-radius: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.06);
      border: 1px solid #f1f5f9;
      padding: 1.5rem; display: flex; flex-direction: column; gap: 0.9rem;
      transition: transform 0.25s, box-shadow 0.25s;
    }
    .policy-card:hover { transform: translateY(-5px); box-shadow: 0 12px 30px rgba(79,70,229,0.12); border-color: #c7d2fe; }

    .card-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .card-badges { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .type-badge {
      display: inline-flex; align-items: center; gap: 0.3rem;
      padding: 0.28rem 0.7rem; border-radius: 20px;
      font-family: 'DM Sans', sans-serif; font-size: 0.72rem; font-weight: 700;
      background: #ede9fe; color: #6d28d9; border: 1px solid #ddd6fe;
    }
    .type-badge.family { background: #fce7f3; color: #9d174d; border-color: #fbcfe8; }
    .cat-badge {
      padding: 0.28rem 0.7rem; border-radius: 20px;
      font-family: 'DM Sans', sans-serif; font-size: 0.72rem; font-weight: 600;
      background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd;
    }
    .card-icon {
      width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(79,70,229,0.3);
    }

    .card-title { font-family: 'Poppins', sans-serif; font-size: 1.05rem; font-weight: 700; color: #0f172a; letter-spacing: -0.2px; }
    .card-desc { font-family: 'Inter', sans-serif; font-size: 0.85rem; color: #64748b; line-height: 1.55; flex: 1; }

    .card-meta {
      display: flex; align-items: center; gap: 0.75rem;
      background: #f8fafc; border-radius: 10px; padding: 0.75rem 1rem;
    }
    .meta-item { display: flex; align-items: center; gap: 0.4rem; }
    .meta-label { font-family: 'Inter', sans-serif; font-size: 0.72rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.4px; }
    .meta-val { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 700; color: #334155; }
    .meta-divider { width: 1px; height: 20px; background: #e2e8f0; }

    .view-btn {
      display: flex; align-items: center; justify-content: center; gap: 0.5rem;
      padding: 0.75rem; background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: white; text-decoration: none; border-radius: 12px;
      font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 700;
      box-shadow: 0 4px 14px rgba(79,70,229,0.3);
      transition: transform 0.2s, box-shadow 0.2s; margin-top: auto;
    }
    .view-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(79,70,229,0.4); }

    /* ── Error State ── */
    .error-state {
      text-align: center; padding: 3.5rem 2rem;
      background: white; border-radius: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.06);
    }
    .error-icon-wrap {
      width: 72px; height: 72px; border-radius: 20px;
      background: linear-gradient(135deg, #dc2626, #f97316);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1.25rem;
      box-shadow: 0 8px 24px rgba(220,38,38,0.3);
    }
    .error-state h3 { font-family: 'Poppins', sans-serif; font-size: 1.2rem; font-weight: 700; color: #0f172a; margin-bottom: 0.4rem; }
    .error-state p { font-family: 'Inter', sans-serif; color: #94a3b8; font-size: 0.88rem; margin-bottom: 1.25rem; }

    /* ── Empty State ── */
    .empty-state {
      text-align: center; padding: 3.5rem 2rem;
      background: white; border-radius: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.06);
    }
    .empty-icon-wrap {
      width: 72px; height: 72px; border-radius: 20px;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1.25rem;
      box-shadow: 0 8px 24px rgba(79,70,229,0.3);
    }
    .empty-state h3 { font-family: 'Poppins', sans-serif; font-size: 1.2rem; font-weight: 700; color: #0f172a; margin-bottom: 0.4rem; }
    .empty-state p { font-family: 'Inter', sans-serif; color: #94a3b8; font-size: 0.88rem; margin-bottom: 1.25rem; }

    .retry-btn {
      display: inline-flex; align-items: center; gap: 0.5rem;
      padding: 0.7rem 1.6rem; background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: white; border: none; border-radius: 10px; cursor: pointer;
      font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 700;
      box-shadow: 0 4px 14px rgba(79,70,229,0.3); transition: transform 0.2s;
    }
    .retry-btn:hover { transform: translateY(-2px); }
  `]
})
export class BrowsePoliciesComponent implements OnInit {
  policies: PolicyResponse[] = [];
  filteredPolicies: PolicyResponse[] = [];
  categories: PolicyCategoryResponse[] = [];
  searchTerm = '';
  selectedCategory = '';
  selectedType = '';
  loading = true;
  hasError = false;

  constructor(private policyService: PolicyService, private categoryService: PolicyCategoryService) {}

  ngOnInit() {
    this.categoryService.getActive().subscribe(res => this.categories = res);
    this.loadPolicies();
  }

  loadPolicies() {
    this.loading = true;
    this.hasError = false;
    this.policyService.getActive().subscribe({
      next: res => { this.policies = res; this.filteredPolicies = res; this.loading = false; },
      error: () => {
        this.policyService.getAll().subscribe({
          next: res => { this.policies = res; this.filteredPolicies = res; this.loading = false; },
          error: () => { this.hasError = true; this.loading = false; }
        });
      }
    });
  }

  filterPolicies() {
    this.filteredPolicies = this.policies.filter(p => {
      const matchSearch = !this.searchTerm ||
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchCategory = !this.selectedCategory || p.categoryId === +this.selectedCategory;
      const matchType = !this.selectedType || p.policyType === this.selectedType;
      return matchSearch && matchCategory && matchType;
    });
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedType = '';
    this.filteredPolicies = this.policies;
  }
}
