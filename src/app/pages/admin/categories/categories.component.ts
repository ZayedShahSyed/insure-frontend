import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PolicyCategoryService } from '../../../services/policy-category.service';
import { PolicyCategoryRequest, PolicyCategoryResponse } from '../../../models';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent, LoadingSpinnerComponent, ConfirmDialogComponent],
  template: `
    <div class="page-header">
      <h1>Policy Categories</h1>
      <p>Manage insurance policy categories</p>
    </div>

    <div class="form-section">
      <h3>{{ editing ? '✏️ Edit Category' : '➕ Create Category' }}</h3>
      <form (ngSubmit)="onSubmit()" class="form-row">
        <input [(ngModel)]="form.name" name="name" placeholder="Category Name" required />
        <input [(ngModel)]="form.description" name="description" placeholder="Description" required class="desc-input" />
        <button type="submit" class="btn-primary">{{ editing ? 'Update' : 'Create' }}</button>
        <button type="button" *ngIf="editing" (click)="cancelEdit()" class="btn-secondary">Cancel</button>
      </form>
    </div>

    <app-loading-spinner *ngIf="loading"></app-loading-spinner>

    <table *ngIf="!loading && categories.length > 0">
      <thead>
        <tr><th>#</th><th>Name</th><th>Description</th><th>Status</th><th>Created</th><th>Actions</th></tr>
      </thead>
      <tbody>
        <tr *ngFor="let cat of categories; let i = index">
          <td>{{ i + 1 }}</td>
          <td><strong>{{ cat.name }}</strong></td>
          <td>{{ cat.description }}</td>
          <td><app-status-badge [status]="cat.isActive ? 'ACTIVE' : 'CANCELLED'"></app-status-badge></td>
          <td>{{ cat.createdAt | date:'mediumDate' }}</td>
          <td>
            <button class="btn-sm btn-edit" (click)="edit(cat)">✏️</button>
            <button class="btn-sm btn-danger" *ngIf="cat.isActive" (click)="confirmRemove(cat)">🗑️</button>
            <button class="btn-sm btn-success" *ngIf="!cat.isActive" (click)="reactivate(cat.id)">♻️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="empty" *ngIf="!loading && categories.length === 0">
      <p>No categories created yet. Create your first category above.</p>
    </div>

    <app-confirm-dialog
      [visible]="showConfirm"
      title="Delete Category"
      [message]="'Are you sure you want to deactivate category: ' + (deleteTarget?.name || '') + '?'"
      confirmText="Deactivate"
      (confirmed)="doRemove()"
      (cancelled)="showConfirm = false">
    </app-confirm-dialog>
  `,
  styles: [`
    .page-header { margin-bottom: 1.5rem; }
    .page-header h1 { margin: 0; font-size: 1.75rem; }
    .page-header p { color: #666; margin-top: 0.25rem; }
    .form-section { background: white; padding: 1.25rem; border-radius: 12px; margin-bottom: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .form-section h3 { margin: 0 0 0.75rem; font-size: 1rem; }
    .form-row { display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; }
    .form-row input { padding: 0.6rem 0.75rem; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.9rem; }
    .desc-input { flex: 1; min-width: 200px; }
    .btn-primary { padding: 0.6rem 1.2rem; background: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; }
    .btn-primary:hover { background: #4338ca; }
    .btn-secondary { padding: 0.6rem 1.2rem; background: #e5e7eb; color: #374151; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    th, td { padding: 0.85rem 1rem; text-align: left; border-bottom: 1px solid #f1f5f9; }
    th { background: #f8fafc; font-weight: 600; font-size: 0.85rem; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
    .btn-sm { padding: 0.35rem 0.5rem; border: none; border-radius: 4px; cursor: pointer; margin-right: 0.25rem; font-size: 0.85rem; background: transparent; }
    .btn-sm:hover { background: #f1f5f9; }
    .btn-edit { color: #4f46e5; }
    .btn-danger { color: #dc2626; }
    .btn-success { color: #16a34a; }
    .empty { text-align: center; padding: 2rem; color: #666; }
  `]
})
export class CategoriesComponent implements OnInit {
  categories: PolicyCategoryResponse[] = [];
  form: PolicyCategoryRequest = { name: '', description: '' };
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
        next: () => { this.toast.success('Category updated'); this.cancelEdit(); this.load(); },
        error: () => this.toast.error('Failed to update category')
      });
    } else {
      this.service.create(this.form).subscribe({
        next: () => { this.toast.success('Category created'); this.form = { name: '', description: '' }; this.load(); },
        error: () => this.toast.error('Failed to create category')
      });
    }
  }

  edit(cat: PolicyCategoryResponse) {
    this.editing = true;
    this.editId = cat.id;
    this.form = { name: cat.name, description: cat.description };
  }

  cancelEdit() {
    this.editing = false;
    this.editId = 0;
    this.form = { name: '', description: '' };
  }

  confirmRemove(cat: PolicyCategoryResponse) {
    this.deleteTarget = cat;
    this.showConfirm = true;
  }

  doRemove() {
    if (this.deleteTarget) {
      this.service.delete(this.deleteTarget.id).subscribe({
        next: () => { this.toast.success('Category deactivated'); this.showConfirm = false; this.load(); },
        error: () => { this.toast.error('Failed to delete'); this.showConfirm = false; }
      });
    }
  }

  reactivate(id: number) {
    this.service.reactivate(id).subscribe({
      next: () => { this.toast.success('Category reactivated'); this.load(); },
      error: () => this.toast.error('Failed to reactivate')
    });
  }
}
