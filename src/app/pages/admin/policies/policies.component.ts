import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PolicyService } from '../../../services/policy.service';
import { PolicyCategoryService } from '../../../services/policy-category.service';
import { PolicyRequest, PolicyResponse, PolicyCategoryResponse } from '../../../models';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-policies',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <h1>Policies</h1>

    <div class="form-section">
      <h3>{{ editing ? 'Edit Policy' : 'Create Policy' }}</h3>
      <form (ngSubmit)="onSubmit()">
        <div class="form-grid">
          <input [(ngModel)]="form.name" name="name" placeholder="Policy Name" required />
          <select [(ngModel)]="form.policyType" name="policyType">
            <option value="INDIVIDUAL">Individual</option>
            <option value="FAMILY_FLOATER">Family Floater</option>
          </select>
          <select [(ngModel)]="form.categoryId" name="categoryId">
            <option *ngFor="let c of categories" [ngValue]="c.id">{{ c.name }}</option>
          </select>
          <input [(ngModel)]="form.minAge" name="minAge" type="number" placeholder="Min Age" />
          <input [(ngModel)]="form.maxAge" name="maxAge" type="number" placeholder="Max Age" />
          <input [(ngModel)]="form.waitingPeriodDays" name="waitingPeriodDays" type="number" placeholder="Waiting Period (days)" />
        </div>
        <textarea [(ngModel)]="form.description" name="description" placeholder="Description" rows="2"></textarea>
        <div class="actions">
          <button type="submit">{{ editing ? 'Update' : 'Create' }}</button>
          <button type="button" *ngIf="editing" (click)="cancelEdit()">Cancel</button>
        </div>
      </form>
    </div>

    <table>
      <thead><tr><th>Code</th><th>Name</th><th>Type</th><th>Category</th><th>Active</th><th>Actions</th></tr></thead>
      <tbody>
        <tr *ngFor="let p of policies">
          <td>{{ p.policyCode }}</td>
          <td>{{ p.name }}</td>
          <td>{{ p.policyType }}</td>
          <td>{{ p.categoryName }}</td>
          <td><span [class]="p.isActive ? 'badge-green' : 'badge-red'">{{ p.isActive ? 'Active' : 'Inactive' }}</span></td>
          <td>
            <button class="btn-sm" (click)="edit(p)">Edit</button>
            <a class="btn-sm btn-link" [routerLink]="[p.id, 'plans']">Plans</a>
            <button class="btn-sm btn-danger" *ngIf="p.isActive" (click)="remove(p.id)">Delete</button>
            <button class="btn-sm btn-success" *ngIf="!p.isActive" (click)="reactivate(p.id)">Reactivate</button>
          </td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [`
    .form-section { background: white; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-bottom: 0.5rem; }
    .form-grid input, .form-grid select { padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; }
    textarea { width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    .actions { margin-top: 0.5rem; }
    .actions button { padding: 0.5rem 1rem; background: #4f46e5; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 0.5rem; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f1f5f9; font-weight: 600; }
    .btn-sm { padding: 0.3rem 0.6rem; border: none; border-radius: 4px; cursor: pointer; margin-right: 0.25rem; background: #4f46e5; color: white; font-size: 0.8rem; text-decoration: none; }
    .btn-danger { background: #dc2626; }
    .btn-success { background: #16a34a; }
    .btn-link { background: #0284c7; }
    .badge-green { color: #16a34a; font-weight: 600; }
    .badge-red { color: #dc2626; font-weight: 600; }
  `]
})
export class PoliciesComponent implements OnInit {
  policies: PolicyResponse[] = [];
  categories: PolicyCategoryResponse[] = [];
  form: PolicyRequest = { name: '', policyType: 'INDIVIDUAL' as any, description: '', categoryId: 0, benefits: {}, exclusions: {}, documents: {}, minAge: 18, maxAge: 65, waitingPeriodDays: 30 };
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
      this.policyService.update(this.editId, this.form).subscribe({ next: () => { this.toast.success('Policy updated'); this.cancelEdit(); this.load(); }, error: () => this.toast.error('Failed to update') });
    } else {
      this.policyService.create(this.form).subscribe({ next: () => { this.toast.success('Policy created'); this.resetForm(); this.load(); }, error: () => this.toast.error('Failed to create') });
    }
  }

  edit(p: PolicyResponse) {
    this.editing = true;
    this.editId = p.id;
    this.form = { name: p.name, policyType: p.policyType as any, description: p.description, categoryId: p.categoryId, benefits: p.benefits || {}, exclusions: p.exclusions || {}, documents: p.documents || {}, minAge: p.minAge, maxAge: p.maxAge, waitingPeriodDays: p.waitingPeriodDays };
  }

  cancelEdit() { this.editing = false; this.editId = 0; this.resetForm(); }

  resetForm() { this.form = { name: '', policyType: 'INDIVIDUAL' as any, description: '', categoryId: 0, benefits: {}, exclusions: {}, documents: {}, minAge: 18, maxAge: 65, waitingPeriodDays: 30 }; }

  remove(id: number) { this.policyService.delete(id).subscribe({ next: () => { this.toast.success('Policy deactivated'); this.load(); }, error: () => this.toast.error('Failed') }); }

  reactivate(id: number) { this.policyService.reactivate(id).subscribe({ next: () => { this.toast.success('Policy reactivated'); this.load(); }, error: () => this.toast.error('Failed') }); }
}

