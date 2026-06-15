import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">

      <div class="top-nav">
        <a routerLink="/" class="brand">
          <img src="logo.jpg" alt="InsureHealth" class="nav-logo">
          <span class="brand-text">InsureHealth</span>
        </a>
      </div>

      <div class="auth-card">
        <h2>Create Account</h2>
        <p class="subtitle">Sign up to get started</p>
        <div class="error" *ngIf="error">{{ error }}</div>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" [(ngModel)]="fullName" name="fullName" required placeholder="John Doe"/>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" required placeholder="you@example.com"/>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" required placeholder="••••••••"/>
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input type="text" [(ngModel)]="phone" name="phone" placeholder="+91 9876543210"/>
          </div>
          <button type="submit" [disabled]="loading">{{ loading ? 'Registering...' : 'Register' }}</button>
        </form>
        <p class="link">Already have an account? <a routerLink="/login">Login</a></p>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500;600&family=DM+Sans:wght@400;500;600&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    .auth-container {
      display: flex; flex-direction: column; align-items: center;
      min-height: 100vh; background: #f8fafc; font-family: 'Inter', sans-serif;
    }

    /* ── Top Nav ── */
    .top-nav {
      width: 100%; padding: 1rem 2rem;
      background: white; border-bottom: 1px solid #e2e8f0;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    }
    .brand {
      display: inline-flex; align-items: center; gap: 0.6rem;
      text-decoration: none; cursor: pointer;
    }
    .nav-logo { height: 34px; width: 34px; object-fit: contain; border-radius: 8px; }
    .brand-text {
      font-family: 'Poppins', sans-serif; font-size: 1.2rem;
      font-weight: 700; color: #0f172a; letter-spacing: -0.3px;
    }
    .brand:hover .brand-text { color: #4f46e5; }

    /* ── Card ── */
    .auth-card {
      background: white; padding: 2.5rem 2rem; border-radius: 20px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08); width: 100%; max-width: 420px;
      margin-top: 3rem; border: 1px solid #f1f5f9;
    }
    h2 { font-family: 'Poppins', sans-serif; font-size: 1.6rem; font-weight: 800; color: #0f172a; text-align: center; margin-bottom: 0.25rem; }
    .subtitle { text-align: center; color: #94a3b8; font-size: 0.88rem; margin-bottom: 1.75rem; }

    .form-group { margin-bottom: 1.1rem; }
    .form-group label { display: block; margin-bottom: 0.35rem; font-weight: 600; font-size: 0.85rem; color: #334155; }
    .form-group input {
      width: 100%; padding: 0.7rem 1rem; border: 1.5px solid #e2e8f0;
      border-radius: 10px; font-size: 0.95rem; font-family: 'Inter', sans-serif;
      outline: none; transition: border-color 0.2s; color: #0f172a;
    }
    .form-group input:focus { border-color: #4f46e5; }

    button {
      width: 100%; padding: 0.8rem;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: white; border: none; border-radius: 10px;
      font-size: 0.95rem; font-family: 'DM Sans', sans-serif;
      font-weight: 700; cursor: pointer; margin-top: 0.5rem;
      box-shadow: 0 4px 14px rgba(79,70,229,0.3);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    button:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(79,70,229,0.4); }
    button:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

    .error { background: #fee2e2; color: #dc2626; padding: 0.6rem 1rem; border-radius: 8px; margin-bottom: 1rem; text-align: center; font-size: 0.85rem; border: 1px solid #fecaca; }
    .link { text-align: center; margin-top: 1.25rem; font-size: 0.88rem; color: #64748b; }
    .link a { color: #4f46e5; font-weight: 600; text-decoration: none; }
    .link a:hover { text-decoration: underline; }
  `]
})
export class RegisterComponent {
  fullName = '';
  email = '';
  password = '';
  phone = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    // 1. Check for empty required fields
    if (!this.fullName || !this.email || !this.password) {
      this.error = 'Full name, email, and password are required.';
      return;
    }

    // 2. Robust Email Validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.email)) {
      this.error = 'Please enter a valid email address (e.g., you@example.com).';
      return;
    }

    // 3. Indian Phone Number Validation
    if (this.phone) {
      const phoneRegex = /^(?:\+?91[\-\s]?)?[6789]\d{9}$/;
      if (!phoneRegex.test(this.phone)) {
        this.error = 'Please enter a valid Indian mobile number (e.g., 9876543210 or +91 9876543210).';
        return;
      }
    }

    // 4. Password Length Validation
    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters.';
      return;
    }

    // 5. Proceed with Registration
    this.loading = true;
    this.error = '';
    
    this.authService.register({
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      phone: this.phone
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/customer']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Registration failed.';
      }
    });
  }
}