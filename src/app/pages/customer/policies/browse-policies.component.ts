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
    <div class="page-header">
      <h1>Browse Policies</h1>
      <p>Find the right health insurance plan for you and your family</p>
    </div>

    <div class="filters">
      <input type="text" [(ngModel)]="searchTerm" placeholder="🔍 Search policies..." class="search-input" (input)="filterPolicies()" />
      <select [(ngModel)]="selectedCategory" (change)="filterPolicies()" class="filter-select">
        <option value="">All Categories</option>
        <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
      </select>
      <select [(ngModel)]="selectedType" (change)="filterPolicies()" class="filter-select">
        <option value="">All Types</option>
        <option value="INDIVIDUAL">Individual</option>
        <option value="FAMILY_FLOATER">Family Floater</option>
      </select>
    </div>

    <app-loading-spinner *ngIf="loading"></app-loading-spinner>

    <div class="grid" *ngIf="!loading">
      <div class="policy-card" *ngFor="let p of filteredPolicies">
        <div class="card-header">
          <span class="policy-type-badge">{{ p.policyType === 'FAMILY_FLOATER' ? '👨‍👩‍👧‍👦 Family' : '👤 Individual' }}</span>
          <span class="category-tag">{{ p.categoryName }}</span>
        </div>
        <h3>{{ p.name }}</h3>
        <p class="description">{{ p.description }}</p>
        <div class="meta">
          <div class="meta-item"><span class="label">Age</span><span class="value">{{ p.minAge }} - {{ p.maxAge }} yrs</span></div>
          <div class="meta-item"><span class="label">Waiting</span><span class="value">{{ p.waitingPeriodDays }} days</span></div>
        </div>
        <a [routerLink]="[p.id]" class="btn">View Plans & Enroll →</a>
      </div>
    </div>

    <div class="empty" *ngIf="!loading && filteredPolicies.length === 0">
      <p>No policies found matching your criteria.</p>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 1.5rem; }
    .page-header h1 { margin: 0; font-size: 1.75rem; }
    .page-header p { color: #666; margin-top: 0.25rem; }
    .filters { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .search-input { flex: 1; min-width: 200px; padding: 0.6rem 1rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; }
    .filter-select { padding: 0.6rem 1rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; background: white; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
    .policy-card { background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s; }
    .policy-card:hover { transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
    .policy-type-badge { font-size: 0.8rem; padding: 0.2rem 0.5rem; background: #ede9fe; color: #5b21b6; border-radius: 4px; }
    .category-tag { font-size: 0.75rem; padding: 0.2rem 0.5rem; background: #e0f2fe; color: #0369a1; border-radius: 4px; }
    .policy-card h3 { margin: 0 0 0.5rem; color: #1e293b; font-size: 1.1rem; }
    .description { color: #64748b; font-size: 0.9rem; margin-bottom: 0.75rem; flex: 1; line-height: 1.5; }
    .meta { display: flex; gap: 1.5rem; margin-bottom: 1rem; padding: 0.75rem; background: #f8fafc; border-radius: 6px; }
    .meta-item { display: flex; flex-direction: column; }
    .meta-item .label { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
    .meta-item .value { font-size: 0.9rem; font-weight: 600; color: #334155; }
    .btn { display: inline-block; padding: 0.6rem 1.2rem; background: #4f46e5; color: white; text-decoration: none; border-radius: 8px; font-size: 0.9rem; text-align: center; transition: background 0.2s; }
    .btn:hover { background: #4338ca; }
    .empty { text-align: center; padding: 3rem; color: #666; }
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

  constructor(private policyService: PolicyService, private categoryService: PolicyCategoryService) {}

  ngOnInit() {
    this.categoryService.getActive().subscribe(res => this.categories = res);
    this.policyService.getAll().subscribe({
      next: res => { this.policies = res; this.filteredPolicies = res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  filterPolicies() {
    this.filteredPolicies = this.policies.filter(p => {
      const matchSearch = !this.searchTerm || p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || p.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchCategory = !this.selectedCategory || p.categoryId === +this.selectedCategory;
      const matchType = !this.selectedType || p.policyType === this.selectedType;
      return matchSearch && matchCategory && matchType;
    });
  }
}
