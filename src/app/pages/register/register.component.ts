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
      <div class="auth-card">
        <h2>Register</h2>
        <div class="error" *ngIf="error">{{ error }}</div>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" [(ngModel)]="fullName" name="fullName" required />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" required />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" required />
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input type="text" [(ngModel)]="phone" name="phone" />
          </div>
          <button type="submit" [disabled]="loading">{{ loading ? 'Registering...' : 'Register' }}</button>
        </form>
        <p class="link">Already have an account? <a routerLink="/login">Login</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f5f7fa; }
    .auth-card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
    h2 { text-align: center; margin-bottom: 1.5rem; color: #333; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.25rem; font-weight: 500; color: #555; }
    .form-group input, .form-group select { width: 100%; padding: 0.6rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; box-sizing: border-box; }
    button { width: 100%; padding: 0.75rem; background: #4f46e5; color: white; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer; }
    button:hover { background: #4338ca; }
    button:disabled { opacity: 0.6; cursor: not-allowed; }
    .error { background: #fee; color: #c00; padding: 0.5rem; border-radius: 4px; margin-bottom: 1rem; text-align: center; }
    .link { text-align: center; margin-top: 1rem; }
    .link a { color: #4f46e5; }
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
    if (!this.fullName || !this.email || !this.password) {
      this.error = 'Full name, email, and password are required.';
      return;
    }
    if (!this.email.includes('@')) {
      this.error = 'Please enter a valid email address.';
      return;
    }
    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.authService.register({
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      phone: this.phone
    }).subscribe({
      next: (res) => {
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

