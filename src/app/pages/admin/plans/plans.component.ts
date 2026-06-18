import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { PolicyPlanService } from "../../../services/policy-plan.service";
import { PolicyPlanRequest, PolicyPlanResponse } from "../../../models";
import { ToastService } from "../../../shared/services/toast.service";

@Component({
  selector: "app-plans",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-wrapper">

      <div class="page-header">
        <div class="ph-left">
          <div class="ph-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          </div>
          <div>
            <h1 class="ph-title">Plans for Policy #{{ policyId }}</h1>
            <p class="ph-sub">Manage coverage plans and premium options</p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="form-card">
        <div class="form-card-header">
          <div class="fch-icon" [class.edit]="editing">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <ng-container *ngIf="!editing"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><line x1="10" y1="17.5" x2="14" y2="17.5"/><line x1="12" y1="15.5" x2="12" y2="19.5"/></ng-container>
              <ng-container *ngIf="editing"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></ng-container>
            </svg>
          </div>
          <h3 class="form-card-title">{{ editing ? "Edit Plan" : "Add New Plan" }}</h3>
        </div>
        <form (ngSubmit)="onSubmit()" class="form-body">
          <div class="form-grid">
            <div class="form-group">
              <label>Plan Name</label>
              <input [(ngModel)]="form.planName" name="planName" placeholder="e.g. Silver Plan" required (blur)="validatePlanName()" [class.input-error]="nameError" />
              <span class="error-message" *ngIf="nameError">{{ nameError }}</span>
            </div>
            <div class="form-group">
              <label>Coverage Amount (&#8377;)</label>
              <input [(ngModel)]="form.coverageAmount" name="coverageAmount" type="number" placeholder="500000" min="1" required (blur)="validateAmount('coverage')" />
              <span class="error-message" *ngIf="amountErrors.coverage">{{ amountErrors.coverage }}</span>
            </div>
            <div class="form-group">
              <label>Premium Amount (&#8377;)</label>
              <input [(ngModel)]="form.premiumAmount" name="premiumAmount" type="number" placeholder="12000" min="1" required (blur)="validateAmount('premium')" />
              <span class="error-message" *ngIf="amountErrors.premium">{{ amountErrors.premium }}</span>
            </div>
            <div class="form-group">
              <label>Premium Basis</label>
              <select [(ngModel)]="form.premiumBasis" name="premiumBasis">
                <option value="FLAT">Flat</option>
                <option value="AGE_BASED">Age Based</option>
              </select>
            </div>
            <div class="form-group">
              <label>Max Members</label>
              <input [(ngModel)]="form.maxMembers" name="maxMembers" type="number" placeholder="4" min="1" step="1" required (blur)="validateMaxMembers()" />
              <span class="error-message" *ngIf="maxMembersError">{{ maxMembersError }}</span>
            </div>
            <div class="form-group renewal-group">
              <label>Options</label>
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="form.renewalAllowed" name="renewalAllowed" />
                <span>Renewal Allowed</span>
              </label>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              {{ editing ? "Update Plan" : "Create Plan" }}
            </button>
            <button type="button" *ngIf="editing" (click)="cancelEdit()" class="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>

      <!-- Table -->
      <div class="table-card" *ngIf="plans.length > 0">
        <div class="table-card-header">
          <h3>All Plans <span class="count-tag">{{ plans.length }}</span></h3>
        </div>
        <table>
          <thead>
            <tr><th>Plan Name</th><th>Coverage</th><th>Premium</th><th>Basis</th><th>Max Members</th><th>Renewal</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let plan of plans">
              <td class="plan-name-cell">{{ plan.planName }}</td>
              <td class="coverage-cell">&#8377;{{ plan.coverageAmount | number }}</td>
              <td class="premium-cell">&#8377;{{ plan.premiumAmount | number }}</td>
              <td><span class="basis-pill">{{ plan.premiumBasis }}</span></td>
              <td class="members-cell">{{ plan.maxMembers }}</td>
              <td>
                <span class="renewal-badge" [class.yes]="plan.renewalAllowed" [class.no]="!plan.renewalAllowed">
                  {{ plan.renewalAllowed ? "Yes" : "No" }}
                </span>
              </td>
              <td>
                <div class="action-btns">
                  <button class="btn-sm btn-edit" (click)="edit(plan)">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                  <button class="btn-sm btn-danger" (click)="remove(plan.id)">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-state" *ngIf="plans.length === 0">
        <div class="empty-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        </div>
        <h3>No plans yet</h3>
        <p>Add coverage plans using the form above.</p>
      </div>
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .page-wrapper { display: flex; flex-direction: column; gap: 1.5rem; font-family: "Inter", sans-serif; }
    .page-header { display: flex; align-items: center; }
    .ph-left { display: flex; align-items: center; gap: 1rem; }
    .ph-icon { width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, #4f46e5, #818cf8); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(79,70,229,0.35); flex-shrink: 0; }
    .ph-title { font-family: "Poppins", sans-serif; font-size: 1.5rem; font-weight: 800; color: #0f172a; letter-spacing: -0.4px; }
    .ph-sub { font-family: "Inter", sans-serif; font-size: 0.85rem; color: #94a3b8; margin-top: 0.15rem; }
    .form-card { background: white; border-radius: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; overflow: hidden; }
    .form-card-header { display: flex; align-items: center; gap: 0.75rem; padding: 1.25rem 1.75rem; background: #f8fafc; border-bottom: 1px solid #f1f5f9; }
    .fch-icon { width: 34px; height: 34px; border-radius: 10px; background: linear-gradient(135deg, #4f46e5, #818cf8); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .fch-icon.edit { background: linear-gradient(135deg, #7c3aed, #a78bfa); }
    .form-card-title { font-family: "Poppins", sans-serif; font-size: 1rem; font-weight: 700; color: #0f172a; }
    .form-body { padding: 1.5rem 1.75rem; }
    .form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.25rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.35rem; }
    .form-group.renewal-group { justify-content: flex-end; }
    .form-group label { font-family: "DM Sans", sans-serif; font-size: 0.8rem; font-weight: 600; color: #374151; }
    .checkbox-label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-family: "DM Sans", sans-serif; font-size: 0.88rem; font-weight: 500; color: #374151; padding: 0.65rem 0.85rem; border: 1.5px solid #e2e8f0; border-radius: 10px; }
    .checkbox-label input { width: 16px; height: 16px; cursor: pointer; accent-color: #4f46e5; }
    .form-group input, .form-group select { padding: 0.65rem 0.85rem; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.88rem; font-family: "Inter", sans-serif; color: #0f172a; transition: border-color 0.2s; background: white; }
    .form-group input:focus, .form-group select:focus { outline: none; border-color: #4f46e5; }
    .error-message { font-family: "DM Sans", sans-serif; font-size: 0.75rem; color: #dc2626; margin-top: 0.25rem; display: block; }
    .form-group input.input-error, .form-group select.input-error { border-color: #dc2626; box-shadow: 0 0 0 3px rgba(220,37,37,0.06); }
    .form-actions { display: flex; gap: 0.75rem; }
    .btn-primary { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.7rem 1.5rem; background: linear-gradient(135deg, #4f46e5, #818cf8); color: white; border: none; border-radius: 10px; cursor: pointer; font-family: "DM Sans", sans-serif; font-size: 0.9rem; font-weight: 700; transition: all 0.2s; box-shadow: 0 4px 12px rgba(79,70,229,0.3); }
    .btn-primary:hover { transform: translateY(-1px); }
    .btn-secondary { padding: 0.7rem 1.2rem; background: #f1f5f9; color: #475569; border: none; border-radius: 10px; cursor: pointer; font-family: "DM Sans", sans-serif; font-size: 0.9rem; font-weight: 600; }
    .table-card { background: white; border-radius: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; overflow: hidden; }
    .table-card-header { display: flex; align-items: center; padding: 1.1rem 1.5rem; background: #f8fafc; border-bottom: 1px solid #f1f5f9; }
    .table-card-header h3 { font-family: "Poppins", sans-serif; font-size: 0.95rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 0.5rem; }
    .count-tag { font-family: "Space Grotesk", sans-serif; font-size: 0.75rem; background: #eef2ff; color: #4f46e5; padding: 0.15rem 0.5rem; border-radius: 6px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f8fafc; padding: 0.85rem 1rem; text-align: left; font-family: "DM Sans", sans-serif; font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid #f1f5f9; }
    td { padding: 0.9rem 1rem; border-bottom: 1px solid #f8fafc; font-size: 0.88rem; color: #334155; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #fafbff; }
    .plan-name-cell { font-family: "DM Sans", sans-serif; font-weight: 700; color: #0f172a; }
    .coverage-cell { font-family: "Space Grotesk", sans-serif; font-weight: 700; color: #4f46e5; }
    .premium-cell { font-family: "Space Grotesk", sans-serif; font-weight: 700; color: #059669; }
    .members-cell { color: #64748b; }
    .basis-pill { background: #f0f4ff; color: #4f46e5; font-family: "DM Sans", sans-serif; font-size: 0.72rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: 6px; }
    .renewal-badge { padding: 0.25rem 0.65rem; border-radius: 20px; font-family: "DM Sans", sans-serif; font-size: 0.72rem; font-weight: 700; }
    .renewal-badge.yes { background: #d1fae5; color: #065f46; }
    .renewal-badge.no { background: #fee2e2; color: #991b1b; }
    .action-btns { display: flex; gap: 0.35rem; }
    .btn-sm { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.35rem 0.75rem; border-radius: 8px; cursor: pointer; font-family: "DM Sans", sans-serif; font-size: 0.78rem; font-weight: 600; transition: all 0.2s; }
    .btn-edit { background: #f0f9ff; color: #0284c7; border: 1px solid #bae6fd; }
    .btn-edit:hover { background: #0284c7; color: white; }
    .btn-danger { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
    .btn-danger:hover { background: #dc2626; color: white; }
    .empty-state { text-align: center; padding: 3.5rem 2rem; background: white; border-radius: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
    .empty-icon { width: 68px; height: 68px; border-radius: 20px; background: linear-gradient(135deg, #4f46e5, #818cf8); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; box-shadow: 0 8px 24px rgba(79,70,229,0.3); }
    .empty-state h3 { font-family: "Poppins", sans-serif; font-size: 1.15rem; font-weight: 700; color: #1e293b; margin-bottom: 0.4rem; }
    .empty-state p { font-size: 0.88rem; color: #94a3b8; }
  `]
})
export class PlansComponent implements OnInit {
  policyId = 0;
  plans: PolicyPlanResponse[] = [];
  form: PolicyPlanRequest = { planName: "", coverageAmount: 0, premiumAmount: 0, premiumBasis: "FLAT", tenureOptions: [1, 2, 3], maxMembers: 4, renewalAllowed: true };
  editing = false;
  editId = 0;
  maxMembersError = "";
  amountErrors: { coverage: string; premium: string } = { coverage: "", premium: "" };
  nameError = "";

  constructor(private route: ActivatedRoute, private service: PolicyPlanService, private toast: ToastService) {}

  ngOnInit() {
    this.policyId = +this.route.snapshot.paramMap.get("id")!;
    this.load();
  }

  load() { this.service.getByPolicy(this.policyId).subscribe(res => this.plans = res); }

  onSubmit() {
    // validate plan name first
    if (!this.validatePlanName()) return;
    if (!this.validateMaxMembers()) return;
    if (!this.validateAmounts()) return;
    if (this.editing) {
      this.service.update(this.editId, this.form).subscribe({ next: () => { this.toast.success("Plan updated"); this.cancelEdit(); this.load(); }, error: () => this.toast.error("Failed to update plan") });
    } else {
      this.service.create(this.policyId, this.form).subscribe({ next: () => { this.toast.success("Plan created"); this.resetForm(); this.load(); }, error: () => this.toast.error("Failed to create plan") });
    }
  }

  validateAmount(type: 'coverage' | 'premium'): void {
    if (type === 'coverage') {
      this.amountErrors.coverage = "";
      if (this.form.coverageAmount === null || this.form.coverageAmount === undefined || this.form.coverageAmount === 0) {
        this.amountErrors.coverage = "Coverage Amount is required";
        return;
      }
      if (this.form.coverageAmount < 1) {
        this.amountErrors.coverage = "Coverage Amount cannot be less than 1";
        this.form.coverageAmount = 1;
        return;
      }
      // ensure whole number
      if (!Number.isInteger(this.form.coverageAmount)) {
        this.amountErrors.coverage = "Coverage Amount must be a whole number";
        this.form.coverageAmount = Math.ceil(this.form.coverageAmount);
        return;
      }
    } else if (type === 'premium') {
      this.amountErrors.premium = "";
      if (this.form.premiumAmount === null || this.form.premiumAmount === undefined || this.form.premiumAmount === 0) {
        this.amountErrors.premium = "Premium Amount is required";
        return;
      }
      if (this.form.premiumAmount < 1) {
        this.amountErrors.premium = "Premium Amount cannot be less than 1";
        this.form.premiumAmount = 1;
        return;
      }
      if (!Number.isInteger(this.form.premiumAmount)) {
        this.amountErrors.premium = "Premium Amount must be a whole number";
        this.form.premiumAmount = Math.ceil(this.form.premiumAmount);
        return;
      }
      // Ensure premium is not greater than coverage
      if (this.form.coverageAmount && this.form.premiumAmount > this.form.coverageAmount) {
        this.amountErrors.premium = "Premium Amount cannot be greater than Coverage Amount";
        return;
      }
    }
  }

  validatePlanName(): boolean {
    this.nameError = "";
    if (!this.form.planName || !this.form.planName.toString().trim()) {
      this.nameError = "Plan Name is required";
      return false;
    }
    if (this.form.planName.toString().trim().length < 2) {
      this.nameError = "Plan Name must be at least 2 characters";
      return false;
    }
    return true;
  }

  validateAmounts(): boolean {
    this.validateAmount('coverage');
    this.validateAmount('premium');
    return !this.amountErrors.coverage && !this.amountErrors.premium;
  }

  validateMaxMembers(): boolean {
    this.maxMembersError = "";

    if (!this.form.maxMembers) {
      this.maxMembersError = "Max Members is required";
      return false;
    }

    if (this.form.maxMembers < 1) {
      this.maxMembersError = "Max Members cannot be negative or zero";
      this.form.maxMembers = 1;
      return false;
    }

    if (!Number.isInteger(this.form.maxMembers)) {
      this.maxMembersError = "Max Members must be a whole number";
      this.form.maxMembers = Math.ceil(this.form.maxMembers);
      return false;
    }

    return true;
  }

  edit(plan: PolicyPlanResponse) {
    this.editing = true;
    this.editId = plan.id;
    this.form = { planName: plan.planName, coverageAmount: plan.coverageAmount, premiumAmount: plan.premiumAmount, premiumBasis: plan.premiumBasis, tenureOptions: plan.tenureOptions || [1, 2, 3], maxMembers: plan.maxMembers, renewalAllowed: plan.renewalAllowed };
  }

  cancelEdit() { this.editing = false; this.editId = 0; this.maxMembersError = ""; this.amountErrors = { coverage: "", premium: "" }; this.resetForm(); }
  resetForm() { this.form = { planName: "", coverageAmount: 0, premiumAmount: 0, premiumBasis: "FLAT", tenureOptions: [1, 2, 3], maxMembers: 4, renewalAllowed: true }; this.maxMembersError = ""; this.amountErrors = { coverage: "", premium: "" }; this.nameError = ""; }
  remove(id: number) { this.service.delete(id).subscribe({ next: () => { this.toast.success("Plan deleted"); this.load(); }, error: () => this.toast.error("Failed to delete") }); }
}
