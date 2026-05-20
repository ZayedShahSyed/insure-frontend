# Insurance Frontend - Backend API Reference & Development Plan

## Project Overview

This is a **Health Insurance Management Application** with two roles:
- **ADMIN** – Manages policies, categories, plans; reviews enrollments and claims
- **CUSTOMER** – Browses policies, enrolls in plans, submits claims

**Backend:** Spring Boot (Java 17+), MySQL, JWT Authentication  
**Backend URL:** `http://localhost:8081`  
**Authentication:** JWT Bearer Token in `Authorization` header

---

## Authentication

All authenticated requests require header: `Authorization: Bearer <token>`

Public endpoints (no auth needed):
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/policies/**` (read-only)
- `GET /api/policy-categories/**` (read-only, via `/api/categories/**` in security config)
- `GET /api/policy-plans/**` (read-only)

---

## Enums (Use these exact values in requests)

| Enum | Values |
|------|--------|
| Role | `ADMIN`, `CUSTOMER` |
| PolicyType | `INDIVIDUAL`, `FAMILY_FLOATER` |
| ClaimStatus | `PENDING`, `UNDER_REVIEW`, `APPROVED`, `REJECTED` |
| ClaimType | `HOSPITALIZATION`, `OPD`, `ACCIDENTAL`, `CRITICAL_ILLNESS`, `MATERNITY`, `DAYCARE`, `OTHER` |
| EnrollmentStatus | `PENDING`, `ACTIVE`, `EXPIRED`, `CANCELLED` |
| PaymentStatus | `PENDING`, `PAID`, `FAILED` |
| PersonType | `MEMBER`, `NOMINEE` |
| PremiumBasis | `FLAT`, `AGE_BASED` |
| Gender | `MALE`, `FEMALE`, `OTHER` |
| Relationship | `SELF`, `SPOUSE`, `CHILD`, `PARENT`, `OTHER` |

---

## API Endpoints

### 1. Auth (`/api/auth`)

#### POST `/api/auth/register`
**Access:** Public  
**Request:**
```json
{
  "fullName": "string",
  "email": "string",
  "password": "string",
  "phone": "string",
  "role": "CUSTOMER" // or "ADMIN"
}
```
**Response (201):**
```json
{
  "token": "string",
  "userId": "number",
  "email": "string",
  "role": "string",
  "fullName": "string"
}
```

#### POST `/api/auth/login`
**Access:** Public  
**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Response (200):**
```json
{
  "token": "string",
  "userId": "number",
  "email": "string",
  "role": "string",
  "fullName": "string"
}
```

#### GET `/api/auth/me`
**Access:** Authenticated  
**Response:**
```json
{
  "userId": "number",
  "email": "string",
  "role": "string"
}
```

---

### 2. Policy Categories (`/api/policy-categories`)

#### POST `/api/policy-categories/create`
**Access:** ADMIN  
**Request:**
```json
{
  "name": "string",
  "description": "string"
}
```
**Response (201): PolicyCategoryResponse**

#### GET `/api/policy-categories/{id}`
**Access:** Authenticated  

#### GET `/api/policy-categories/active`
**Access:** Public/Authenticated  

#### GET `/api/policy-categories/all`
**Access:** ADMIN  

#### PUT `/api/policy-categories/{id}`
**Access:** ADMIN  
**Request:** Same as create

#### DELETE `/api/policy-categories/{id}`
**Access:** ADMIN  

#### PATCH `/api/policy-categories/{id}/reactivate`
**Access:** ADMIN  

**PolicyCategoryResponse:**
```json
{
  "id": "number",
  "name": "string",
  "description": "string",
  "isActive": "boolean",
  "createdAt": "datetime"
}
```

---

### 3. Policies (`/api/policies`)

#### POST `/api/policies`
**Access:** ADMIN  
**Request:**
```json
{
  "name": "string",
  "policyType": "INDIVIDUAL | FAMILY_FLOATER",
  "description": "string",
  "categoryId": "number",
  "benefits": { "key": "value" },
  "exclusions": { "key": "value" },
  "documents": { "key": "value" },
  "minAge": "number",
  "maxAge": "number",
  "waitingPeriodDays": "number"
}
```

#### GET `/api/policies`
**Access:** Public — returns active policies only

#### GET `/api/policies/{id}`
**Access:** Public

#### PUT `/api/policies/{id}`
**Access:** ADMIN  
**Request:** Same as create

#### DELETE `/api/policies/{id}`
**Access:** ADMIN (soft delete)

#### PATCH `/api/policies/{id}/reactivate`
**Access:** ADMIN

**PolicyResponse:**
```json
{
  "id": "number",
  "policyCode": "string",
  "name": "string",
  "policyType": "string",
  "description": "string",
  "categoryId": "number",
  "categoryName": "string",
  "benefits": {},
  "exclusions": {},
  "documents": {},
  "minAge": "number",
  "maxAge": "number",
  "waitingPeriodDays": "number",
  "isActive": "boolean",
  "createdById": "number",
  "createdByName": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

---

### 4. Policy Plans (`/api/policy-plans`)

#### POST `/api/policy-plans?policyId={policyId}`
**Access:** ADMIN  
**Request:**
```json
{
  "planName": "string",
  "coverageAmount": "number",
  "premiumAmount": "number",
  "premiumBasis": "FLAT | AGE_BASED",
  "tenureOptions": [1, 2, 3],
  "maxMembers": "number",
  "roomRentLimit": "number",
  "renewalAllowed": "boolean"
}
```

#### GET `/api/policy-plans/{id}`
**Access:** Public

#### GET `/api/policy-plans/policy/{policyId}`
**Access:** Public — get all plans for a policy

#### PUT `/api/policy-plans/{id}`
**Access:** ADMIN  
**Request:** Same as create

#### DELETE `/api/policy-plans/{id}`
**Access:** ADMIN (returns 204)

**PolicyPlanResponse:**
```json
{
  "id": "number",
  "planName": "string",
  "coverageAmount": "number",
  "premiumAmount": "number",
  "premiumBasis": "string",
  "tenureOptions": [1, 2, 3],
  "maxMembers": "number",
  "roomRentLimit": "number",
  "renewalAllowed": "boolean",
  "policyId": "number",
  "policyName": "string"
}
```

---

### 5. Enrollments (`/api/enrollments`)

#### POST `/api/enrollments`
**Access:** CUSTOMER  
**Request:**
```json
{
  "policyPlanId": "number",
  "tenureYears": "number",
  "members": [
    {
      "fullName": "string",
      "personType": "MEMBER | NOMINEE",
      "relationship": "SELF | SPOUSE | CHILD | PARENT | OTHER",
      "dateOfBirth": "YYYY-MM-DD",
      "gender": "MALE | FEMALE | OTHER",
      "phone": "string"
    }
  ]
}
```

#### GET `/api/enrollments/my`
**Access:** Authenticated (returns current user's enrollments)

#### GET `/api/enrollments/{id}`
**Access:** Authenticated

#### GET `/api/enrollments/policy/{policyId}`
**Access:** ADMIN

#### PUT `/api/enrollments/{id}/approve`
**Access:** ADMIN

#### PUT `/api/enrollments/{id}/cancel`
**Access:** Authenticated

**EnrollmentResponse:**
```json
{
  "id": "number",
  "enrollmentNumber": "string",
  "policyName": "string",
  "planName": "string",
  "premiumAmount": "number",
  "tenureYears": "number",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "paymentStatus": "PENDING | PAID | FAILED",
  "status": "PENDING | ACTIVE | EXPIRED | CANCELLED",
  "customerName": "string",
  "approvedAt": "datetime",
  "approvedBy": "string",
  "members": [ EnrollmentPersonResponse ],
  "createdAt": "datetime"
}
```

**EnrollmentPersonResponse:**
```json
{
  "id": "number",
  "fullName": "string",
  "personType": "string",
  "relationship": "string",
  "dateOfBirth": "YYYY-MM-DD",
  "gender": "string",
  "phone": "string"
}
```

---

### 6. Claims (`/api/claims`)

#### POST `/api/claims`
**Access:** CUSTOMER  
**Request:**
```json
{
  "enrollmentId": "number",
  "claimType": "HOSPITALIZATION | OPD | ACCIDENTAL | CRITICAL_ILLNESS | MATERNITY | DAYCARE | OTHER",
  "incidentDate": "YYYY-MM-DD",
  "hospitalName": "string",
  "diagnosis": "string",
  "description": "string",
  "claimedAmount": "number",
  "documents": { "bills": "url", "discharge_summary": "url" }
}
```

#### GET `/api/claims/my`
**Access:** CUSTOMER

#### GET `/api/claims/{id}`
**Access:** Authenticated

#### GET `/api/claims/all`
**Access:** ADMIN

#### GET `/api/claims/status/{status}`
**Access:** ADMIN  
**Path param:** `PENDING`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`

#### PUT `/api/claims/{id}/review`
**Access:** ADMIN  
**Request:**
```json
{
  "status": "UNDER_REVIEW | APPROVED | REJECTED",
  "approvedAmount": "number (required if APPROVED)",
  "adminRemarks": "string (required if REJECTED)"
}
```

**ClaimResponse:**
```json
{
  "id": "number",
  "claimNumber": "string",
  "claimType": "string",
  "incidentDate": "YYYY-MM-DD",
  "hospitalName": "string",
  "diagnosis": "string",
  "description": "string",
  "claimedAmount": "number",
  "approvedAmount": "number",
  "status": "string",
  "adminRemarks": "string",
  "reviewedAt": "datetime",
  "reviewedBy": "string",
  "documents": {},
  "enrollmentId": "number",
  "enrollmentNumber": "string",
  "policyName": "string",
  "planName": "string",
  "customerId": "number",
  "customerName": "string",
  "customerEmail": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

---

### 7. Admin Dashboard (`/api/admin/dashboard`)

#### GET `/api/admin/dashboard`
**Access:** ADMIN  
**Response:**
```json
{
  "totalPolicies": "number",
  "activePolicies": "number",
  "totalCustomers": "number",
  "totalEnrollments": "number",
  "activeEnrollments": "number",
  "pendingEnrollments": "number",
  "totalClaims": "number",
  "pendingClaims": "number",
  "underReviewClaims": "number",
  "approvedClaimsThisMonth": "number",
  "rejectedClaimsThisMonth": "number"
}
```

---

### 8. Customer Dashboard (`/api/customer/dashboard`)

#### GET `/api/customer/dashboard`
**Access:** CUSTOMER  
**Response:**
```json
{
  "customerName": "string",
  "email": "string",
  "totalEnrollments": "number",
  "activeEnrollments": "number",
  "pendingEnrollments": "number",
  "totalClaims": "number",
  "pendingClaims": "number",
  "approvedClaims": "number",
  "rejectedClaims": "number",
  "activePolices": [ EnrollmentResponse ],
  "recentEnrollments": [ EnrollmentResponse ],
  "recentClaims": [ ClaimResponse ]
}
```

---

## Entity Relationships

```
User (ADMIN/CUSTOMER)
  ├── creates Policy (ADMIN)
  ├── has PolicyEnrollment (CUSTOMER)
  └── has Claim (CUSTOMER)

PolicyCategory
  └── has many Policy

Policy
  └── has many PolicyPlan

PolicyPlan
  └── has many PolicyEnrollment

PolicyEnrollment
  ├── has many EnrollmentPerson (members/nominees)
  └── has many Claim
```

---

## Frontend Development Plan (Step-by-Step)

### Phase 1: Project Setup
1. Initialize Angular project (already created at `insure-frontend/`)
2. Install dependencies: `@angular/material`, `@angular/cdk`, `tailwindcss` (or chosen UI library)
3. Configure `environment.ts` with `apiUrl: 'http://localhost:8081'`
4. Set up `HttpClientModule` and create an `AuthInterceptor` to attach JWT token to all requests
5. Set up routing structure with lazy-loaded modules

### Phase 2: Core Services & Models
1. Create TypeScript interfaces/models for all DTOs (PolicyResponse, ClaimResponse, etc.)
2. Create enum files matching backend enums
3. Create Angular services:
   - `AuthService` – login, register, token storage, current user
   - `PolicyService` – CRUD policies
   - `PolicyCategoryService` – CRUD categories
   - `PolicyPlanService` – CRUD plans
   - `EnrollmentService` – enroll, list, approve, cancel
   - `ClaimService` – submit, list, review
   - `DashboardService` – admin & customer dashboards
   - `Home Page` - Home page about the application and its features.
4. Create route guards: `AuthGuard`, `AdminGuard`, `CustomerGuard`

### Phase 3: Authentication Module
1. Login page with email/password form
2. Register page with fullName, email, password, phone, role selection
3. Store JWT token in localStorage
4. Auto-redirect based on role after login
5. Logout functionality (clear token, redirect to login)

### Phase 4: Shared/Layout Components
1. Navbar/Sidebar with role-based menu items
2. Layout component (admin layout vs customer layout)
3. Reusable components: data tables, cards, status badges, confirmation dialogs
4. Loading spinners, toast notifications for success/error

### Phase 5: Customer Module
1. **Customer Dashboard** – summary cards, active policies, recent claims
2. **Browse Policies** – list all active policies with category filter
3. **Policy Detail** – view policy info, plans, enroll button
4. **Enrollment Form** – select plan, tenure, add members/nominees
5. **My Enrollments** – list enrollments with status badges
6. **Submit Claim** – form with enrollment dropdown, claim details, documents
7. **My Claims** – list claims with status, view detail

### Phase 6: Admin Module
1. **Admin Dashboard** – stats cards (policies, enrollments, claims counts)
2. **Manage Categories** – CRUD table with create/edit modal, soft delete/reactivate
3. **Manage Policies** – CRUD table, create/edit form with category dropdown
4. **Manage Plans** – nested under policy, CRUD plans per policy
5. **Enrollment Management** – list all enrollments, approve/reject actions
6. **Claims Management** – list all claims, filter by status, review modal (approve/reject with amount/remarks)

### Phase 7: Polish & Edge Cases
1. Form validations matching backend constraints
2. Error handling (401 redirect to login, 403 forbidden page, 404 not found)
3. Responsive design for mobile/tablet
4. Role-based route protection (redirect if unauthorized)
5. Date formatting, currency formatting
6. Empty states for lists
7. Pagination if needed (backend currently returns all)

### Phase 8: Testing & Deployment
1. Unit tests for services and components
2. E2E tests for critical flows (login, enroll, submit claim)
3. Build optimization and production build configuration
4. CORS configuration verification with backend

---

## Important Notes for Agent

- Backend runs on port **8081**, no CORS config seen — may need to add proxy config in Angular (`proxy.conf.json`) pointing `/api` → `http://localhost:8081`
- JWT token is returned on login/register — store in localStorage, attach via HTTP interceptor
- Soft delete pattern: entities have `isActive` field; DELETE endpoints deactivate, PATCH `/reactivate` reactivates
- `benefits`, `exclusions`, `documents` fields are flexible JSON maps (key-value pairs)
- Policy Plan `tenureOptions` is a list of integers (years)
- Enrollment requires at least one member in `members` array
- `policyPlanId` passed as query param for plan creation: `POST /api/policy-plans?policyId=X`
- Dates use format `YYYY-MM-DD` for LocalDate, ISO datetime for LocalDateTime

