import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { EnrollmentService } from '../../../services/enrollment.service';
import { ClaimService } from '../../../services/claim.service';
import { CustomerUserResponse } from '../../../models';
import { EnrollmentResponse, ClaimResponse } from '../../../models';

interface EnrichedCustomer extends CustomerUserResponse {
  enrollmentCount: number;
  activeCount: number;
  enrollments: EnrollmentResponse[];
}

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-wrapper">

      <!-- Header -->
      <div class="page-header">
        <div class="ph-left">
          <div class="ph-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div>
            <h1 class="ph-title">Customer Management</h1>
            <p class="ph-sub">View all registered customers and their policy enrollments</p>
          </div>
        </div>
        <div class="ph-stats">
          <div class="ph-stat">
            <span class="ph-stat-num">{{ enrolledCustomers.length }}</span>
            <span class="ph-stat-label">Enrolled</span>
          </div>
          <div class="ph-stat-divider"></div>
          <div class="ph-stat">
            <span class="ph-stat-num">{{ unenrolledCustomers.length }}</span>
            <span class="ph-stat-label">Account Only</span>
          </div>
          <div class="ph-stat-divider"></div>
          <div class="ph-stat">
            <span class="ph-stat-num">{{ enrolledCustomers.length + unenrolledCustomers.length }}</span>
            <span class="ph-stat-label">Total</span>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading customers…</p>
      </div>

      <ng-container *ngIf="!loading">

        <!-- Search bar -->
        <div class="search-bar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input [(ngModel)]="searchTerm" (ngModelChange)="applyFilter()" placeholder="Search by name or email…" />
        </div>

        <!-- ── Section 1: Enrolled Customers ── -->
        <div class="section-card">
          <div class="section-header enrolled">
            <div class="sh-left">
              <div class="sh-dot green"></div>
              <h2>Customers with Policy Enrollments</h2>
              <span class="sh-badge green">{{ filteredEnrolled.length }}</span>
            </div>
          </div>

          <div *ngIf="filteredEnrolled.length === 0" class="empty-inline">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            No enrolled customers found.
          </div>

          <div *ngIf="filteredEnrolled.length > 0" class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Occupation</th>
                  <th>Enrollments</th>
                  <th>Active Policies</th>
                  <th>Account Status</th>
                  <th>Joined</th>
                  <th>Last Login</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let c of filteredEnrolled; let i = index" [class.expanded]="expandedId === c.userId">
                  <td class="td-rank">{{ i + 1 }}</td>
                  <td class="td-customer">
                    <div class="avatar" [style.background]="getAvatarColor(c.fullName)">{{ getInitial(c.fullName) }}</div>
                    <div>
                      <span class="cust-name">{{ c.fullName }}</span>
                      <span class="cust-gender" *ngIf="c.gender">{{ c.gender }}</span>
                    </div>
                  </td>
                  <td class="td-email">{{ c.email }}</td>
                  <td class="td-phone">{{ c.phone || '—' }}</td>
                  <td class="td-city">{{ c.city || '—' }}</td>
                  <td class="td-occ">{{ c.occupation || '—' }}</td>
                  <td class="td-center"><span class="badge blue">{{ c.enrollmentCount }}</span></td>
                  <td class="td-center">
                    <span class="badge green" *ngIf="c.activeCount > 0">{{ c.activeCount }} Active</span>
                    <span class="badge grey" *ngIf="c.activeCount === 0">None</span>
                  </td>
                  <td class="td-center">
                    <span class="badge green" *ngIf="c.isActive !== false">Active</span>
                    <span class="badge red" *ngIf="c.isActive === false">Inactive</span>
                  </td>
                  <td class="td-date">{{ c.createdAt | date:'dd MMM yyyy' }}</td>
                  <td class="td-date">{{ c.lastLoginAt ? (c.lastLoginAt | date:'dd MMM, HH:mm') : '—' }}</td>
                  <td>
                    <button class="btn-expand" (click)="toggleExpand(c.userId)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                        [attr.transform]="expandedId === c.userId ? 'rotate(180)' : ''">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                      {{ expandedId === c.userId ? 'Hide' : 'View' }}
                    </button>
                  </td>
                </tr>
                <!-- Expanded enrollment details -->
                <ng-container *ngFor="let c of filteredEnrolled">
                  <tr *ngIf="expandedId === c.userId" class="expand-row">
                    <td colspan="12">
                      <div class="expand-panel">
                        <div class="expand-profile">
                          <div class="ep-item" *ngIf="c.dateOfBirth"><span class="ep-label">Date of Birth</span><span class="ep-val">{{ c.dateOfBirth | date:'dd MMM yyyy' }}</span></div>
                          <div class="ep-item" *ngIf="c.address"><span class="ep-label">Address</span><span class="ep-val">{{ c.address }}{{ c.city ? ', ' + c.city : '' }}{{ c.state ? ', ' + c.state : '' }}{{ c.pincode ? ' - ' + c.pincode : '' }}</span></div>
                        </div>
                        <p class="expand-title">Enrollments for <strong>{{ c.fullName }}</strong></p>
                        <table class="inner-table">
                          <thead>
                            <tr>
                              <th>Enrollment #</th>
                              <th>Policy</th>
                              <th>Plan</th>
                              <th>Premium</th>
                              <th>Start</th>
                              <th>End</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr *ngFor="let e of c.enrollments">
                              <td class="mono">{{ e.enrollmentNumber }}</td>
                              <td>{{ e.policyName }}</td>
                              <td>{{ e.planName }}</td>
                              <td>&#8377;{{ e.premiumAmount | number }}</td>
                              <td>{{ e.startDate | date:'dd MMM yyyy' }}</td>
                              <td>{{ e.endDate | date:'dd MMM yyyy' }}</td>
                              <td><span [class]="'estatus ' + e.status.toLowerCase()">{{ e.status }}</span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                </ng-container>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ── Section 2: Account-Only Customers ── -->
        <div class="section-card">
          <div class="section-header unenrolled">
            <div class="sh-left">
              <div class="sh-dot amber"></div>
              <h2>Customers without Any Enrollment</h2>
              <span class="sh-badge amber">{{ filteredUnenrolled.length }}</span>
            </div>
          </div>

          <div *ngIf="filteredUnenrolled.length === 0" class="empty-inline">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            {{ unenrolledCustomers.length === 0 && !apiSupported ? 'Customer list endpoint not available — only enrollment-based data is shown above.' : 'All registered customers have at least one enrollment.' }}
          </div>

          <div *ngIf="filteredUnenrolled.length > 0" class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Occupation</th>
                  <th>Account Status</th>
                  <th>Joined</th>
                  <th>Last Login</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let c of filteredUnenrolled; let i = index">
                  <td class="td-rank">{{ i + 1 }}</td>
                  <td class="td-customer">
                    <div class="avatar" [style.background]="getAvatarColor(c.fullName)">{{ getInitial(c.fullName) }}</div>
                    <div>
                      <span class="cust-name">{{ c.fullName }}</span>
                      <span class="cust-gender" *ngIf="c.gender">{{ c.gender }}</span>
                    </div>
                  </td>
                  <td class="td-email">{{ c.email }}</td>
                  <td class="td-phone">{{ c.phone || '—' }}</td>
                  <td class="td-city">{{ c.city || '—' }}</td>
                  <td class="td-occ">{{ c.occupation || '—' }}</td>
                  <td class="td-center">
                    <span class="badge green" *ngIf="c.isActive !== false">Active</span>
                    <span class="badge red" *ngIf="c.isActive === false">Inactive</span>
                  </td>
                  <td class="td-date">{{ c.createdAt | date:'dd MMM yyyy' }}</td>
                  <td class="td-date">{{ c.lastLoginAt ? (c.lastLoginAt | date:'dd MMM, HH:mm') : '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </ng-container>
    </div>
  `,
  styles: [`

    * { box-sizing: border-box; margin: 0; padding: 0; }
    .page-wrapper { display: flex; flex-direction: column; gap: 1.8rem; font-family: 'Inter', sans-serif; }

    /* Header */
    .page-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; background: linear-gradient(135deg, #0a0f1e 0%, #0a2251 100%); border-radius: 20px; padding: 1.8rem 2rem; }
    .ph-left { display: flex; align-items: center; gap: 1rem; }
    .ph-icon { width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, #0ea5e9, #0284c7); display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 6px 18px rgba(14,165,233,0.35); }
    .ph-title { font-family: 'Poppins', sans-serif; font-size: 1.3rem; font-weight: 700; color: white; }
    .ph-sub { font-size: 0.82rem; color: #93c5fd; margin-top: 0.2rem; }
    .ph-stats { display: flex; align-items: center; gap: 1.2rem; background: rgba(255,255,255,0.07); border-radius: 14px; padding: 0.9rem 1.4rem; }
    .ph-stat { text-align: center; }
    .ph-stat-num { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 1.4rem; font-weight: 800; color: white; }
    .ph-stat-label { font-size: 0.72rem; color: #93c5fd; text-transform: uppercase; letter-spacing: 0.5px; }
    .ph-stat-divider { width: 1px; height: 32px; background: rgba(255,255,255,0.15); }

    /* Loading */
    .loading-state { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 4rem; color: #94a3b8; }
    .spinner { width: 36px; height: 36px; border: 3px solid #e2e8f0; border-top-color: #0284c7; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Search */
    .search-bar { display: flex; align-items: center; gap: 0.75rem; background: white; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0.65rem 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
    .search-bar input { border: none; outline: none; font-family: 'Inter', sans-serif; font-size: 0.9rem; color: #1e293b; width: 100%; background: transparent; }
    .search-bar input::placeholder { color: #94a3b8; }

    /* Section cards */
    .section-card { background: white; border-radius: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); overflow: hidden; }
    .section-header { padding: 1.2rem 1.5rem; border-bottom: 1px solid #f1f5f9; }
    .section-header.enrolled { border-left: 4px solid #16a34a; }
    .section-header.unenrolled { border-left: 4px solid #d97706; }
    .sh-left { display: flex; align-items: center; gap: 0.75rem; }
    .sh-dot { width: 10px; height: 10px; border-radius: 50%; }
    .sh-dot.green { background: #16a34a; box-shadow: 0 0 6px rgba(22,163,74,0.5); }
    .sh-dot.amber { background: #d97706; box-shadow: 0 0 6px rgba(217,119,6,0.5); }
    .section-header h2 { font-family: 'Poppins', sans-serif; font-size: 0.95rem; font-weight: 700; color: #1e293b; }
    .sh-badge { padding: 0.2rem 0.65rem; border-radius: 20px; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 700; }
    .sh-badge.green { background: #dcfce7; color: #15803d; }
    .sh-badge.amber { background: #fef3c7; color: #b45309; }

    /* Empty inline */
    .empty-inline { display: flex; align-items: center; gap: 0.5rem; padding: 2rem 1.5rem; color: #94a3b8; font-size: 0.88rem; font-style: italic; }

    /* Table */
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
    thead tr { background: #f8fafc; }
    th { padding: 0.75rem 1rem; text-align: left; font-family: 'DM Sans', sans-serif; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }
    td { padding: 0.85rem 1rem; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: middle; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #fafbff; }
    tr.expanded td { background: #f0f9ff; }

    /* Customer cell */
    .td-customer { display: flex; align-items: center; gap: 0.65rem; white-space: nowrap; }
    .avatar { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-family: 'Space Grotesk', sans-serif; font-size: 0.82rem; font-weight: 700; flex-shrink: 0; }
    .cust-name { font-family: 'DM Sans', sans-serif; font-weight: 600; color: #1e293b; }
    .td-rank { color: #94a3b8; font-family: 'Space Grotesk', sans-serif; font-size: 0.78rem; font-weight: 700; width: 36px; }
    .td-email { color: #475569; font-size: 0.82rem; }
    .td-phone { color: #64748b; font-size: 0.82rem; }
    .td-center { text-align: center; }
    .td-date { color: #64748b; font-size: 0.8rem; white-space: nowrap; }

    /* Badges */
    .badge { display: inline-block; padding: 0.25rem 0.7rem; border-radius: 20px; font-family: 'Space Grotesk', sans-serif; font-size: 0.72rem; font-weight: 700; white-space: nowrap; }
    .badge.blue { background: #dbeafe; color: #1d4ed8; }
    .badge.green { background: #dcfce7; color: #15803d; }
    .badge.grey { background: #f1f5f9; color: #64748b; }
    .badge.amber { background: #fef3c7; color: #b45309; }
    .badge.red { background: #fee2e2; color: #991b1b; }
    .td-city { color: #475569; font-size: 0.82rem; }
    .td-occ { color: #475569; font-size: 0.82rem; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .cust-gender { display: block; font-size: 0.7rem; color: #94a3b8; font-family: 'Inter', sans-serif; text-transform: capitalize; }
    .ep-item { display: flex; flex-direction: column; gap: 0.15rem; }
    .ep-label { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.4px; font-family: 'DM Sans', sans-serif; }
    .ep-val { font-size: 0.82rem; color: #334155; font-family: 'Inter', sans-serif; }
    .expand-profile { display: flex; gap: 2rem; flex-wrap: wrap; margin-bottom: 1rem; padding: 0.75rem 1rem; background: #e0f2fe; border-radius: 8px; }

    /* Expand button */
    .btn-expand { display: inline-flex; align-items: center; gap: 0.3rem; background: #f0f9ff; color: #0284c7; border: 1px solid #bae6fd; border-radius: 8px; padding: 0.35rem 0.75rem; font-size: 0.78rem; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s; }
    .btn-expand:hover { background: #0284c7; color: white; }

    /* Expand panel */
    .expand-row td { padding: 0; background: #f0f9ff !important; }
    .expand-panel { padding: 1rem 1.5rem 1.2rem; border-top: 2px dashed #bae6fd; }
    .expand-title { font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600; color: #0284c7; margin-bottom: 0.75rem; }
    .inner-table { width: 100%; border-collapse: collapse; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    .inner-table th { padding: 0.6rem 0.9rem; background: #e0f2fe; color: #0369a1; font-size: 0.72rem; font-family: 'DM Sans', sans-serif; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; }
    .inner-table td { padding: 0.65rem 0.9rem; border-bottom: 1px solid #f1f5f9; font-size: 0.82rem; color: #334155; }
    .inner-table tr:last-child td { border-bottom: none; }
    .mono { font-family: 'Space Grotesk', sans-serif; font-size: 0.78rem; color: #0284c7; }

    /* Enrollment status badges */
    .estatus { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.7rem; font-weight: 700; font-family: 'Space Grotesk', sans-serif; text-transform: uppercase; }
    .estatus.active { background: #dcfce7; color: #15803d; }
    .estatus.pending { background: #fef3c7; color: #b45309; }
    .estatus.cancelled { background: #fee2e2; color: #991b1b; }
    .estatus.expired { background: #f1f5f9; color: #64748b; }
  `]
})
export class AdminCustomersComponent implements OnInit {
  loading = true;
  apiSupported = true;
  enrolledCustomers: EnrichedCustomer[] = [];
  unenrolledCustomers: CustomerUserResponse[] = [];
  filteredEnrolled: EnrichedCustomer[] = [];
  filteredUnenrolled: CustomerUserResponse[] = [];
  expandedId: number | null = null;
  searchTerm = '';

  private avatarColors = ['#0284c7','#7c3aed','#059669','#d97706','#dc2626','#0891b2','#9333ea','#16a34a'];

  constructor(
    private authService: AuthService,
    private enrollmentService: EnrollmentService,
    private claimService: ClaimService
  ) {}

  ngOnInit() {
    forkJoin({
      customers: this.authService.getCustomers(),
      enrollments: this.enrollmentService.getAll()
    }).subscribe({
      next: ({ customers, enrollments }) => {
        this.buildCustomerData(customers, enrollments);
        this.loading = false;
      },
      error: () => {
        // Fallback: derive customers from enrollments + claims combined
        this.apiSupported = false;
        forkJoin({
          enrollments: this.enrollmentService.getAll(),
          claims: this.claimService.getAll()
        }).subscribe({
          next: ({ enrollments, claims }) => {
            this.buildFromActivityData(enrollments, claims);
            this.loading = false;
          },
          error: () => {
            // Last resort: enrollments only
            this.enrollmentService.getAll().subscribe({
              next: enrollments => { this.buildFromActivityData(enrollments, []); this.loading = false; },
              error: () => { this.loading = false; }
            });
          }
        });
      }
    });
  }

  private buildCustomerData(customers: CustomerUserResponse[], enrollments: EnrollmentResponse[]) {
    // Build maps keyed by both id and email (backend may not always return customerId)
    const enrollmentById = new Map<number, EnrollmentResponse[]>();
    const enrollmentByEmail = new Map<string, EnrollmentResponse[]>();
    for (const e of enrollments) {
      if (e.customerId) {
        if (!enrollmentById.has(e.customerId)) enrollmentById.set(e.customerId, []);
        enrollmentById.get(e.customerId)!.push(e);
      }
      if (e.customerEmail) {
        const key = e.customerEmail.toLowerCase();
        if (!enrollmentByEmail.has(key)) enrollmentByEmail.set(key, []);
        enrollmentByEmail.get(key)!.push(e);
      }
    }

    const getEnrollments = (c: CustomerUserResponse): EnrollmentResponse[] =>
      enrollmentById.get(c.userId) ?? enrollmentByEmail.get(c.email?.toLowerCase()) ?? [];

    // A customer is "enrolled" only if they have at least one ACTIVE or PENDING enrollment.
    // Customers with only CANCELLED/EXPIRED enrollments move to the unenrolled section.
    const isEnrolled = (c: CustomerUserResponse) =>
      getEnrollments(c).some(e => e.status === 'ACTIVE' || e.status === 'PENDING');

    this.enrolledCustomers = customers
      .filter(c => isEnrolled(c))
      .map(c => ({
        ...c,
        enrollmentCount: getEnrollments(c).filter(e => e.status === 'ACTIVE' || e.status === 'PENDING').length,
        activeCount: getEnrollments(c).filter(e => e.status === 'ACTIVE').length,
        enrollments: getEnrollments(c)
      }));

    this.unenrolledCustomers = customers.filter(c => !isEnrolled(c));
    this.applyFilter();
  }

  private buildFromActivityData(enrollments: EnrollmentResponse[], claims: ClaimResponse[]) {
    const seen = new Map<number, EnrichedCustomer>();

    // First pass: seed from claims (name + email from claims for any customer)
    for (const c of claims) {
      if (!seen.has(c.customerId)) {
        seen.set(c.customerId, {
          userId: c.customerId,
          fullName: c.customerName,
          email: c.customerEmail,
          phone: '',
          createdAt: c.createdAt,
          enrollmentCount: 0,
          activeCount: 0,
          enrollments: []
        });
      }
    }

    // Second pass: merge enrollments (richer data — phone, enrollment details)
    for (const e of enrollments) {
      if (!seen.has(e.customerId)) {
        seen.set(e.customerId, {
          userId: e.customerId,
          fullName: e.customerName,
          email: e.customerEmail,
          phone: e.customerPhone,
          createdAt: e.createdAt,
          enrollmentCount: 0,
          activeCount: 0,
          enrollments: []
        });
      }
      const cust = seen.get(e.customerId)!;
      // Enrich phone if we only had claims data
      if (!cust.phone && e.customerPhone) cust.phone = e.customerPhone;
      cust.enrollmentCount++;
      if (e.status === 'ACTIVE') cust.activeCount++;
      cust.enrollments.push(e);
    }

    this.enrolledCustomers = Array.from(seen.values()).filter(c => c.enrollmentCount > 0);
    this.unenrolledCustomers = Array.from(seen.values()).filter(c => c.enrollmentCount === 0);
    this.applyFilter();
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredEnrolled = term
      ? this.enrolledCustomers.filter(c => c.fullName.toLowerCase().includes(term) || c.email.toLowerCase().includes(term))
      : [...this.enrolledCustomers];
    this.filteredUnenrolled = term
      ? this.unenrolledCustomers.filter(c => c.fullName.toLowerCase().includes(term) || c.email.toLowerCase().includes(term))
      : [...this.unenrolledCustomers];
  }

  toggleExpand(id: number) {
    this.expandedId = this.expandedId === id ? null : id;
  }

  getInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  getAvatarColor(name: string): string {
    const i = name ? name.charCodeAt(0) % this.avatarColors.length : 0;
    return this.avatarColors[i];
  }
}
