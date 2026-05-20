import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PolicyPlanService } from '../../../services/policy-plan.service';
import { PolicyPlanRequest, PolicyPlanResponse } from '../../../models';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Plans for Policy #{{ policyId }}</h1>

    <div class="form-section">
      <h3>{{ editing ? 'Edit Plan' : 'Add Plan' }}</h3>
      <form (ngSubmit)="onSubmit()">
        <div class="form-grid">
          <input [(ngModel)]="form.planName" name="planName" placeholder="Plan Name" required />
          <input [(ngModel)]="form.coverageAmount" name="coverageAmount" type="number" placeholder="Coverage Amount" />
          <input [(ngModel)]="form.premiumAmount" name="premiumAmount" type="number" placeholder="Premium Amount" />
          <select [(ngModel)]="form.premiumBasis" name="premiumBasis">
            <option value="FLAT">Flat</option>
//             <option value="AGE_BASED">Age Based</option>
          </select>
          <input [(ngModel)]="form.maxMembers" name="maxMembers" type="number" placeholder="Max Members" />
        </div>
        <div class="actions">
          <label><input type="checkbox" [(ngModel)]="form.renewalAllowed" name="renewalAllowed" /> Renewal Allowed</label>
          <button type="submit">{{ editing ? 'Update' : 'Create' }}</button>
          <button type="button" *ngIf="editing" (click)="cancelEdit()">Cancel</button>
        </div>
      </form>
    </div>

    <table>
      <thead><tr><th>Plan Name</th><th>Coverage</th><th>Premium</th><th>Basis</th><th>Max Members</th><th>Actions</th></tr></thead>
      <tbody>
        <tr *ngFor="let plan of plans">
          <td>{{ plan.planName }}</td>
          <td>₹{{ plan.coverageAmount | number }}</td>
          <td>₹{{ plan.premiumAmount | number }}</td>
          <td>{{ plan.premiumBasis }}</td>
          <td>{{ plan.maxMembers }}</td>
          <td>
            <button class="btn-sm" (click)="edit(plan)">Edit</button>
            <button class="btn-sm btn-danger" (click)="remove(plan.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [`
    .form-section { background: white; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-bottom: 0.5rem; }
    .form-grid input, .form-grid select { padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; }
    .actions { margin-top: 0.5rem; }
    .actions button { padding: 0.5rem 1rem; background: #4f46e5; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 0.5rem; }
    .actions label { margin-right: 1rem; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f1f5f9; font-weight: 600; }
    .btn-sm { padding: 0.3rem 0.6rem; border: none; border-radius: 4px; cursor: pointer; margin-right: 0.25rem; background: #4f46e5; color: white; font-size: 0.8rem; }
    .btn-danger { background: #dc2626; }
  `]
})
export class PlansComponent implements OnInit {
  policyId = 0;
  plans: PolicyPlanResponse[] = [];
  form: PolicyPlanRequest = { planName: '', coverageAmount: 0, premiumAmount: 0, premiumBasis: 'FLAT', tenureOptions: [1, 2, 3], maxMembers: 4, renewalAllowed: true };
  editing = false;
  editId = 0;

  constructor(private route: ActivatedRoute, private service: PolicyPlanService, private toast: ToastService) {}

  ngOnInit() {
    this.policyId = +this.route.snapshot.paramMap.get('id')!;
    this.load();
  }

  load() { this.service.getByPolicy(this.policyId).subscribe(res => this.plans = res); }

  onSubmit() {
    if (this.editing) {
      this.service.update(this.editId, this.form).subscribe({ next: () => { this.toast.success('Plan updated'); this.cancelEdit(); this.load(); }, error: () => this.toast.error('Failed to update plan') });
    } else {
      this.service.create(this.policyId, this.form).subscribe({ next: () => { this.toast.success('Plan created'); this.resetForm(); this.load(); }, error: () => this.toast.error('Failed to create plan') });
    }
  }

  edit(plan: PolicyPlanResponse) {
    this.editing = true;
    this.editId = plan.id;
    this.form = { planName: plan.planName, coverageAmount: plan.coverageAmount, premiumAmount: plan.premiumAmount, premiumBasis: plan.premiumBasis, tenureOptions: plan.tenureOptions || [1, 2, 3], maxMembers: plan.maxMembers, renewalAllowed: plan.renewalAllowed };
  }

  cancelEdit() { this.editing = false; this.editId = 0; this.resetForm(); }
  resetForm() { this.form = { planName: '', coverageAmount: 0, premiumAmount: 0, premiumBasis: 'FLAT', tenureOptions: [1, 2, 3], maxMembers: 4, renewalAllowed: true }; }
  remove(id: number) { this.service.delete(id).subscribe({ next: () => { this.toast.success('Plan deleted'); this.load(); }, error: () => this.toast.error('Failed to delete') }); }
}

