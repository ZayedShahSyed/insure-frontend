import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { PolicyService } from "../../../services/policy.service";
import { PolicyCategoryService } from "../../../services/policy-category.service";
import { PolicyRequest, PolicyResponse, PolicyCategoryResponse } from "../../../models";
import { ToastService } from "../../../shared/services/toast.service";

@Component({
  selector: "app-policies",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-wrapper">

      <div class="page-header">
        <div class="ph-left">
          <div class="ph-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div>
            <h1 class="ph-title">Policy Management</h1>
            <p class="ph-sub">Create, edit and manage insurance policies</p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="form-card">
        <div class="form-card-header">
          <div class="fch-icon" [class.edit]="editing">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <ng-container *ngIf="!editing"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></ng-container>
              <ng-container *ngIf="editing"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></ng-container>
            </svg>
          </div>
          <h3 class="form-card-title">{{ editing ? "Edit Policy" : "Create New Policy" }}</h3>
        </div>
        <form (ngSubmit)="onSubmit()" class="form-body">
          <div class="form-grid">
            <div class="form-group">
              <label>Policy Name</label>
              <input [(ngModel)]="form.name" name="name" placeholder="e.g. ComprehensiveCare Plus" required />
            </div>
            <div class="form-group">
              <label>Policy Type</label>
              <select [(ngModel)]="form.policyType" name="policyType">
                <option value="INDIVIDUAL">Individual</option>
                <option value="FAMILY_FLOATER">Family Floater</option>
              </select>
            </div>
            <div class="form-group">
              <label>Category</label>
              <select [(ngModel)]="form.categoryId" name="categoryId">
                <option *ngFor="let c of categories" [ngValue]="c.id">{{ c.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Min Age</label>
              <input [(ngModel)]="form.minAge" name="minAge" type="number" placeholder="18" />
            </div>
            <div class="form-group">
              <label>Max Age</label>
              <input [(ngModel)]="form.maxAge" name="maxAge" type="number" placeholder="65" />
            </div>
            <div class="form-group">
              <label>Waiting Period (days)</label>
              <input [(ngModel)]="form.waitingPeriodDays" name="waitingPeriodDays" type="number" placeholder="30" />
            </div>
            <div class="form-group full-span">
              <label>Description</label>
              <textarea [(ngModel)]="form.description" name="description" placeholder="Policy description..." rows="2"></textarea>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              {{ editing ? "Update Policy" : "Create Policy" }}
            </button>
            <button type="button" *ngIf="editing" (click)="cancelEdit()" class="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>

      <!-- Table -->
      <div class="table-card" *ngIf="policies.length > 0">
        <div class="table-card-header">
          <h3>All Policies <span class="count-tag">{{ policies.length }}</span></h3>
        </div>
        <table>
          <thead>
            <tr><th>Code</th><th>Name</th><th>Type</th><th>Category</th><th>Age Range</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of policies">
              <td><span class="code-badge">{{ p.policyCode }}</span></td>
              <td class="policy-name-cell">{{ p.name }}</td>
              <td><span class="type-pill">{{ p.policyType === "FAMILY_FLOATER" ? "Family" : "Individual" }}</span></td>
              <td>{{ p.categoryName }}</td>
              <td class="age-range">{{ p.minAge }}–{{ p.maxAge }} yrs</td>
              <td>
                <span class="status-badge" [class.active]="p.isActive" [class.inactive]="!p.isActive">
                  {{ p.isActive ? "Active" : "Inactive" }}
                </span>
              </td>
              <td>
                <div class="action-btns">
                  <button class="btn-sm btn-edit" (click)="edit(p)">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                  <a class="btn-sm btn-plans" [routerLink]="[p.id, 'plans']">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
                    Plans
                  </a>
                  <button class="btn-sm btn-danger" *ngIf="p.isActive" (click)="remove(p.id)">Deactivate</button>
                  <button class="btn-sm btn-success" *ngIf="!p.isActive" (click)="reactivate(p.id)">Reactivate</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-state" *ngIf="policies.length === 0">
        <div class="empty-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <h3>No policies yet</h3>
        <p>Create your first insurance policy using the form above.</p>
      </div>

    </div>
  `,
  styles: [`
    @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@700&display=swap");
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .page-wrapper { display: flex; flex-direction: column; gap: 1.5rem; font-family: "Inter", sans-serif; }
    .page-header { display: flex; align-items: center; }
    .ph-left { display: flex; align-items: center; gap: 1rem; }
    .ph-icon { width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, #0284c7, #38bdf8); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(2,132,199,0.35); flex-shrink: 0; }
    .ph-title { font-family: "Poppins", sans-serif; font-size: 1.5rem; font-weight: 800; color: #0f172a; letter-spacing: -0.4px; }
    .ph-sub { font-family: "Inter", sans-serif; font-size: 0.85rem; color: #94a3b8; margin-top: 0.15rem; }
    .form-card { background: white; border-radius: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; overflow: hidden; }
    .form-card-header { display: flex; align-items: center; gap: 0.75rem; padding: 1.25rem 1.75rem; background: #f8fafc; border-bottom: 1px solid #f1f5f9; }
    .fch-icon { width: 34px; height: 34px; border-radius: 10px; background: linear-gradient(135deg, #0284c7, #38bdf8); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .fch-icon.edit { background: linear-gradient(135deg, #7c3aed, #a78bfa); }
    .form-card-title { font-family: "Poppins", sans-serif; font-size: 1rem; font-weight: 700; color: #0f172a; }
    .form-body { padding: 1.5rem 1.75rem; }
    .form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.25rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.35rem; }
    .form-group.full-span { grid-column: 1 / -1; }
    .form-group label { font-family: "DM Sans", sans-serif; font-size: 0.8rem; font-weight: 600; color: #374151; }
    .form-group input, .form-group select, .form-group textarea { padding: 0.65rem 0.85rem; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.88rem; font-family: "Inter", sans-serif; color: #0f172a; transition: border-color 0.2s; background: white; }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: #0284c7; }
    .form-actions { display: flex; gap: 0.75rem; }
    .btn-primary { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.7rem 1.5rem; background: linear-gradient(135deg, #0284c7, #0ea5e9); color: white; border: none; border-radius: 10px; cursor: pointer; font-family: "DM Sans", sans-serif; font-size: 0.9rem; font-weight: 700; transition: all 0.2s; box-shadow: 0 4px 12px rgba(2,132,199,0.3); }
    .btn-primary:hover { transform: translateY(-1px); }
    .btn-secondary { padding: 0.7rem 1.2rem; background: #f1f5f9; color: #475569; border: none; border-radius: 10px; cursor: pointer; font-family: "DM Sans", sans-serif; font-size: 0.9rem; font-weight: 600; }
    .btn-secondary:hover { background: #e2e8f0; }
    .table-card { background: white; border-radius: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; overflow: hidden; }
    .table-card-header { display: flex; align-items: center; padding: 1.1rem 1.5rem; background: #f8fafc; border-bottom: 1px solid #f1f5f9; }
    .table-card-header h3 { font-family: "Poppins", sans-serif; font-size: 0.95rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 0.5rem; }
    .count-tag { font-family: "Space Grotesk", sans-serif; font-size: 0.75rem; background: #e0f2fe; color: #0284c7; padding: 0.15rem 0.5rem; border-radius: 6px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f8fafc; padding: 0.85rem 1rem; text-align: left; font-family: "DM Sans", sans-serif; font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid #f1f5f9; }
    td { padding: 0.9rem 1rem; border-bottom: 1px solid #f8fafc; font-size: 0.88rem; color: #334155; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #fafbff; }
    .code-badge { font-family: "Space Grotesk", sans-serif; font-size: 0.75rem; font-weight: 700; background: #f0f9ff; color: #0284c7; padding: 0.2rem 0.5rem; border-radius: 6px; }
    .policy-name-cell { font-family: "DM Sans", sans-serif; font-weight: 600; color: #0f172a; }
    .type-pill { background: #f0f4ff; color: #4f46e5; font-family: "DM Sans", sans-serif; font-size: 0.72rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: 6px; }
    .age-range { color: #64748b; font-size: 0.83rem; }
    .status-badge { padding: 0.25rem 0.65rem; border-radius: 20px; font-family: "DM Sans", sans-serif; font-size: 0.72rem; font-weight: 700; }
    .status-badge.active { background: #d1fae5; color: #065f46; }
    .status-badge.inactive { background: #fee2e2; color: #991b1b; }
    .action-btns { display: flex; gap: 0.35rem; flex-wrap: wrap; }
    .btn-sm { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.35rem 0.75rem; border: none; border-radius: 8px; cursor: pointer; font-family: "DM Sans", sans-serif; font-size: 0.78rem; font-weight: 600; transition: all 0.2s; text-decoration: none; }
    .btn-edit { background: #f0f9ff; color: #0284c7; border: 1px solid #bae6fd; }
    .btn-edit:hover { background: #0284c7; color: white; }
    .btn-plans { background: #f5f3ff; color: #7c3aed; border: 1px solid #ddd6fe; }
    .btn-plans:hover { background: #7c3aed; color: white; }
    .btn-danger { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
    .btn-danger:hover { background: #dc2626; color: white; }
    .btn-success { background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }
    .btn-success:hover { background: #059669; color: white; }
    .empty-state { text-align: center; padding: 3.5rem 2rem; background: white; border-radius: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
    .empty-icon { width: 68px; height: 68px; border-radius: 20px; background: linear-gradient(135deg, #0284c7, #38bdf8); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; box-shadow: 0 8px 24px rgba(2,132,199,0.3); }
    .empty-state h3 { font-family: "Poppins", sans-serif; font-size: 1.15rem; font-weight: 700; color: #1e293b; margin-bottom: 0.4rem; }
    .empty-state p { font-size: 0.88rem; color: #94a3b8; }
  `]
})
export class PoliciesComponent implements OnInit {
  policies: PolicyResponse[] = [];
  categories: PolicyCategoryResponse[] = [];
  form: PolicyRequest = { name: "", policyType: "INDIVIDUAL" as any, description: "", categoryId: 0, benefits: {}, exclusions: {}, documents: {}, minAge: 18, maxAge: 65, waitingPeriodDays: 30 };
  editing = false;
  editId = 0;

  constructor(private policyService: PolicyService, private categoryService: PolicyCategoryService, private toast: ToastService) {}

  ngOnInit() {
    this.load();
    this.categoryService.getActive().subscribe(res => this.categories = res);
  }

  load() { this.policyService.getMyPolicies().subscribe(res => this.policies = res); }

  onSubmit() {
    if (this.editing) {
      this.policyService.update(this.editId, this.form).subscribe({ next: () => { this.toast.success("Policy updated"); this.cancelEdit(); this.load(); }, error: () => this.toast.error("Failed to update") });
    } else {
      this.policyService.create(this.form).subscribe({ next: () => { this.toast.success("Policy created"); this.resetForm(); this.load(); }, error: () => this.toast.error("Failed to create") });
    }
  }

  edit(p: PolicyResponse) {
    this.editing = true;
    this.editId = p.id;
    this.form = { name: p.name, policyType: p.policyType as any, description: p.description, categoryId: p.categoryId, benefits: p.benefits || {}, exclusions: p.exclusions || {}, documents: p.documents || {}, minAge: p.minAge, maxAge: p.maxAge, waitingPeriodDays: p.waitingPeriodDays };
  }

  cancelEdit() { this.editing = false; this.editId = 0; this.resetForm(); }
  resetForm() { this.form = { name: "", policyType: "INDIVIDUAL" as any, description: "", categoryId: 0, benefits: {}, exclusions: {}, documents: {}, minAge: 18, maxAge: 65, waitingPeriodDays: 30 }; }
  remove(id: number) { this.policyService.delete(id).subscribe({ next: () => { this.toast.success("Policy deactivated"); this.load(); }, error: () => this.toast.error("Failed") }); }
  reactivate(id: number) { this.policyService.reactivate(id).subscribe({ next: () => { this.toast.success("Policy reactivated"); this.load(); }, error: () => this.toast.error("Failed") }); }
}
