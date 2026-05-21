import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PolicyCategoryService } from "../../../services/policy-category.service";
import { PolicyCategoryRequest, PolicyCategoryResponse } from "../../../models";
import { StatusBadgeComponent } from "../../../shared/components/status-badge/status-badge.component";
import { LoadingSpinnerComponent } from "../../../shared/components/loading-spinner/loading-spinner.component";
import { ConfirmDialogComponent } from "../../../shared/components/confirm-dialog/confirm-dialog.component";
import { ToastService } from "../../../shared/services/toast.service";

@Component({
  selector: "app-categories",
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent, LoadingSpinnerComponent, ConfirmDialogComponent],
  template: `
    <div class="page-wrapper">

      <div class="page-header">
        <div class="ph-left">
          <div class="ph-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
          </div>
          <div>
            <h1 class="ph-title">Policy Categories</h1>
            <p class="ph-sub">Manage insurance policy categories</p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="form-card">
        <div class="form-card-header">
          <div class="fch-icon" [class.edit]="editing">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <ng-container *ngIf="!editing"><path d="M4 6h16M4 12h16M4 18h7"/><line x1="18" y1="15" x2="18" y2="21"/><line x1="15" y1="18" x2="21" y2="18"/></ng-container>
              <ng-container *ngIf="editing"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></ng-container>
            </svg>
          </div>
          <h3 class="form-card-title">{{ editing ? "Edit Category" : "Create New Category" }}</h3>
        </div>
        <form (ngSubmit)="onSubmit()" class="form-body">
          <div class="form-row">
            <div class="form-group">
              <label>Category Name</label>
              <input [(ngModel)]="form.name" name="name" placeholder="e.g. Critical Illness" required />
            </div>
            <div class="form-group flex-1">
              <label>Description</label>
              <input [(ngModel)]="form.description" name="description" placeholder="Brief description of this category" required />
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              {{ editing ? "Update Category" : "Create Category" }}
            </button>
            <button type="button" *ngIf="editing" (click)="cancelEdit()" class="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>

      <app-loading-spinner *ngIf="loading"></app-loading-spinner>

      <div class="table-card" *ngIf="!loading && categories.length > 0">
        <div class="table-card-header">
          <h3>All Categories <span class="count-tag">{{ categories.length }}</span></h3>
        </div>
        <table>
          <thead>
            <tr><th>#</th><th>Name</th><th>Description</th><th>Status</th><th>Created</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let cat of categories; let i = index">
              <td><span class="index-badge">{{ i + 1 }}</span></td>
              <td class="cat-name">{{ cat.name }}</td>
              <td class="cat-desc">{{ cat.description }}</td>
              <td><app-status-badge [status]="cat.isActive ? 'ACTIVE' : 'CANCELLED'"></app-status-badge></td>
              <td class="date-cell">{{ cat.createdAt | date:"mediumDate" }}</td>
              <td>
                <div class="action-btns">
                  <button class="btn-sm btn-edit" (click)="edit(cat)">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                  <button class="btn-sm btn-danger" *ngIf="cat.isActive" (click)="confirmRemove(cat)">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                    Deactivate
                  </button>
                  <button class="btn-sm btn-success" *ngIf="!cat.isActive" (click)="reactivate(cat.id)">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>
                    Reactivate
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-state" *ngIf="!loading && categories.length === 0">
        <div class="empty-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
        </div>
        <h3>No categories yet</h3>
        <p>Create your first policy category using the form above.</p>
      </div>
    </div>

    <app-confirm-dialog [visible]="showConfirm" title="Deactivate Category"
      [message]="'Are you sure you want to deactivate: ' + (deleteTarget?.name || '') + '?'"
      confirmText="Deactivate" (confirmed)="doRemove()" (cancelled)="showConfirm = false">
    </app-confirm-dialog>
  `,
  styles: [`
    @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@700&display=swap");
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .page-wrapper { display: flex; flex-direction: column; gap: 1.5rem; font-family: "Inter", sans-serif; }
    .page-header { display: flex; align-items: center; }
    .ph-left { display: flex; align-items: center; gap: 1rem; }
    .ph-icon { width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, #059669, #34d399); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(5,150,105,0.35); flex-shrink: 0; }
    .ph-title { font-family: "Poppins", sans-serif; font-size: 1.5rem; font-weight: 800; color: #0f172a; letter-spacing: -0.4px; }
    .ph-sub { font-family: "Inter", sans-serif; font-size: 0.85rem; color: #94a3b8; margin-top: 0.15rem; }
    .form-card { background: white; border-radius: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; overflow: hidden; }
    .form-card-header { display: flex; align-items: center; gap: 0.75rem; padding: 1.25rem 1.75rem; background: #f8fafc; border-bottom: 1px solid #f1f5f9; }
    .fch-icon { width: 34px; height: 34px; border-radius: 10px; background: linear-gradient(135deg, #059669, #34d399); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .fch-icon.edit { background: linear-gradient(135deg, #7c3aed, #a78bfa); }
    .form-card-title { font-family: "Poppins", sans-serif; font-size: 1rem; font-weight: 700; color: #0f172a; }
    .form-body { padding: 1.5rem 1.75rem; }
    .form-row { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.25rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.35rem; min-width: 200px; }
    .form-group.flex-1 { flex: 1; }
    .form-group label { font-family: "DM Sans", sans-serif; font-size: 0.8rem; font-weight: 600; color: #374151; }
    .form-group input { padding: 0.65rem 0.85rem; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.88rem; font-family: "Inter", sans-serif; color: #0f172a; transition: border-color 0.2s; }
    .form-group input:focus { outline: none; border-color: #059669; }
    .form-actions { display: flex; gap: 0.75rem; }
    .btn-primary { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.7rem 1.5rem; background: linear-gradient(135deg, #059669, #34d399); color: white; border: none; border-radius: 10px; cursor: pointer; font-family: "DM Sans", sans-serif; font-size: 0.9rem; font-weight: 700; transition: all 0.2s; box-shadow: 0 4px 12px rgba(5,150,105,0.3); }
    .btn-primary:hover { transform: translateY(-1px); }
    .btn-secondary { padding: 0.7rem 1.2rem; background: #f1f5f9; color: #475569; border: none; border-radius: 10px; cursor: pointer; font-family: "DM Sans", sans-serif; font-size: 0.9rem; font-weight: 600; }
    .table-card { background: white; border-radius: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; overflow: hidden; }
    .table-card-header { display: flex; align-items: center; padding: 1.1rem 1.5rem; background: #f8fafc; border-bottom: 1px solid #f1f5f9; }
    .table-card-header h3 { font-family: "Poppins", sans-serif; font-size: 0.95rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 0.5rem; }
    .count-tag { font-family: "Space Grotesk", sans-serif; font-size: 0.75rem; background: #d1fae5; color: #065f46; padding: 0.15rem 0.5rem; border-radius: 6px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f8fafc; padding: 0.85rem 1rem; text-align: left; font-family: "DM Sans", sans-serif; font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid #f1f5f9; }
    td { padding: 0.9rem 1rem; border-bottom: 1px solid #f8fafc; font-size: 0.88rem; color: #334155; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #fafbff; }
    .index-badge { width: 26px; height: 26px; border-radius: 8px; background: #f8fafc; color: #94a3b8; font-family: "Space Grotesk", sans-serif; font-size: 0.75rem; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; }
    .cat-name { font-family: "DM Sans", sans-serif; font-weight: 700; color: #0f172a; }
    .cat-desc { color: #64748b; font-size: 0.85rem; max-width: 280px; }
    .date-cell { color: #94a3b8; font-size: 0.82rem; }
    .action-btns { display: flex; gap: 0.35rem; flex-wrap: wrap; }
    .btn-sm { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.35rem 0.75rem; border-radius: 8px; cursor: pointer; font-family: "DM Sans", sans-serif; font-size: 0.78rem; font-weight: 600; transition: all 0.2s; }
    .btn-edit { background: #f0f9ff; color: #0284c7; border: 1px solid #bae6fd; }
    .btn-edit:hover { background: #0284c7; color: white; }
    .btn-danger { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
    .btn-danger:hover { background: #dc2626; color: white; }
    .btn-success { background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }
    .btn-success:hover { background: #059669; color: white; }
    .empty-state { text-align: center; padding: 3.5rem 2rem; background: white; border-radius: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
    .empty-icon { width: 68px; height: 68px; border-radius: 20px; background: linear-gradient(135deg, #059669, #34d399); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; box-shadow: 0 8px 24px rgba(5,150,105,0.3); }
    .empty-state h3 { font-family: "Poppins", sans-serif; font-size: 1.15rem; font-weight: 700; color: #1e293b; margin-bottom: 0.4rem; }
    .empty-state p { font-size: 0.88rem; color: #94a3b8; }
  `]
})
export class CategoriesComponent implements OnInit {
  categories: PolicyCategoryResponse[] = [];
  form: PolicyCategoryRequest = { name: "", description: "" };
  editing = false;
  editId = 0;
  loading = true;
  showConfirm = false;
  deleteTarget: PolicyCategoryResponse | null = null;

  constructor(private service: PolicyCategoryService, private toast: ToastService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.service.getAll().subscribe({
      next: res => { this.categories = res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onSubmit() {
    if (this.editing) {
      this.service.update(this.editId, this.form).subscribe({
        next: () => { this.toast.success("Category updated"); this.cancelEdit(); this.load(); },
        error: () => this.toast.error("Failed to update category")
      });
    } else {
      this.service.create(this.form).subscribe({
        next: () => { this.toast.success("Category created"); this.form = { name: "", description: "" }; this.load(); },
        error: () => this.toast.error("Failed to create category")
      });
    }
  }

  edit(cat: PolicyCategoryResponse) {
    this.editing = true;
    this.editId = cat.id;
    this.form = { name: cat.name, description: cat.description };
  }

  cancelEdit() { this.editing = false; this.editId = 0; this.form = { name: "", description: "" }; }

  confirmRemove(cat: PolicyCategoryResponse) { this.deleteTarget = cat; this.showConfirm = true; }

  doRemove() {
    if (this.deleteTarget) {
      this.service.delete(this.deleteTarget.id).subscribe({
        next: () => { this.toast.success("Category deactivated"); this.showConfirm = false; this.load(); },
        error: () => { this.toast.error("Failed to delete"); this.showConfirm = false; }
      });
    }
  }

  reactivate(id: number) {
    this.service.reactivate(id).subscribe({
      next: () => { this.toast.success("Category reactivated"); this.load(); },
      error: () => this.toast.error("Failed to reactivate")
    });
  }
}
