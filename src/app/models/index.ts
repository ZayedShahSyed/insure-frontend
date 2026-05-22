// Enums
export enum Role {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER'
}

export enum PolicyType {
  INDIVIDUAL = 'INDIVIDUAL',
  FAMILY_FLOATER = 'FAMILY_FLOATER'
}

export enum ClaimStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum ClaimType {
  HOSPITALIZATION = 'HOSPITALIZATION',
  OPD = 'OPD',
  ACCIDENTAL = 'ACCIDENTAL',
  CRITICAL_ILLNESS = 'CRITICAL_ILLNESS',
  MATERNITY = 'MATERNITY',
  DAYCARE = 'DAYCARE',
  OTHER = 'OTHER'
}

export enum EnrollmentStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED'
}

export enum PersonType {
  MEMBER = 'MEMBER',
  NOMINEE = 'NOMINEE'
}

export enum PremiumBasis {
  FLAT = 'FLAT',
  AGE_BASED = 'AGE_BASED'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum Relationship {
  SELF = 'SELF',
  SPOUSE = 'SPOUSE',
  CHILD = 'CHILD',
  PARENT = 'PARENT',
  OTHER = 'OTHER'
}

// Interfaces

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  role: string;
  fullName: string;
}

export interface CustomerUserResponse {
  userId: number;
  fullName: string;
  email: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  occupation?: string;
  isActive?: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface CurrentUser {
  userId: number;
  email: string;
  role: string;
}

// Policy Category
export interface PolicyCategoryRequest {
  name: string;
  description: string;
}

export interface PolicyCategoryResponse {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

// Policy
export interface PolicyRequest {
  name: string;
  policyType: PolicyType;
  description: string;
  categoryId: number;
  benefits: Record<string, any>;
  exclusions: Record<string, any>;
  documents: Record<string, any>;
  minAge: number;
  maxAge: number;
  waitingPeriodDays: number;
}

export interface PolicyResponse {
  id: number;
  policyCode: string;
  name: string;
  policyType: string;
  description: string;
  categoryId: number;
  categoryName: string;
  benefits: Record<string, any>;
  exclusions: Record<string, any>;
  documents: Record<string, any>;
  minAge: number;
  maxAge: number;
  waitingPeriodDays: number;
  isActive: boolean;
  createdById: number;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

// Policy Plan
export interface PolicyPlanRequest {
  planName: string;
  coverageAmount: number;
  premiumAmount: number;
  premiumBasis: string;
  tenureOptions: number[];
  maxMembers: number;
  renewalAllowed: boolean;
}

export interface PolicyPlanResponse {
  id: number;
  planName: string;
  coverageAmount: number;
  premiumAmount: number;
  premiumBasis: string;
  tenureOptions: number[];
  maxMembers: number;
  renewalAllowed: boolean;
  policyId: number;
  policyName: string;
  policyType: string;
}

// Enrollment
export interface EnrollmentPersonRequest {
  fullName: string;
  personType: string;
  relationship: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
}

export interface EnrollmentPersonResponse {
  id: number;
  fullName: string;
  personType: string;
  relationship: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
}

export interface EnrollmentRequest {
  policyPlanId: number;
  tenureYears: number;
  members: EnrollmentPersonRequest[];
}

export interface EnrollmentResponse {
  id: number;
  enrollmentNumber: string;
  policyName: string;
  planName: string;
  premiumAmount: number;
  customerId: number;
  customerEmail: string;
  customerPhone: string;
  tenureYears: number;
  startDate: string;
  endDate: string;
  paymentStatus: string;
  status: string;
  customerName: string;
  coverageAmount: number;
  policyType: string;
  approvedAt: string;
  approvedBy: string;
  members: EnrollmentPersonResponse[];
  createdAt: string;
}

// Claims
export interface ClaimRequest {
  enrollmentId: number;
  claimType: string;
  incidentDate: string;
  hospitalName: string;
  diagnosis: string;
  description: string;
  claimedAmount: number;
  documents: Record<string, any>;
}

export interface ClaimReviewRequest {
  status: string;
  approvedAmount?: number;
  adminRemarks?: string;
}

export interface ClaimResponse {
  id: number;
  claimNumber: string;
  claimType: string;
  incidentDate: string;
  hospitalName: string;
  diagnosis: string;
  description: string;
  claimedAmount: number;
  approvedAmount: number;
  status: string;
  adminRemarks: string;
  reviewedAt: string;
  reviewedBy: string;
  documents: Record<string, any>;
  enrollmentId: number;
  enrollmentNumber: string;
  policyName: string;
  planName: string;
  customerId: number;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboards
export interface AdminDashboardResponse {
  totalPolicies: number;
  activePolicies: number;
  totalCustomers: number;
  totalEnrollments: number;
  activeEnrollments: number;
  pendingEnrollments: number;
  totalClaims: number;
  pendingClaims: number;
  underReviewClaims: number;
  approvedClaimsThisMonth: number;
  rejectedClaimsThisMonth: number;
}

export interface CustomerDashboardResponse {
  customerName: string;
  email: string;
  totalEnrollments: number;
  activeEnrollments: number;
  pendingEnrollments: number;
  totalClaims: number;
  pendingClaims: number;
  approvedClaims: number;
  rejectedClaims: number;
  activePolices: EnrollmentResponse[];
  recentEnrollments: EnrollmentResponse[];
  recentClaims: ClaimResponse[];
}

