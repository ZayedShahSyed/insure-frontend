import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="layout">
      <nav class="sidebar">
        <div class="brand">🏥 InsureAdmin</div>
        <ul>
          <li><a routerLink="dashboard" routerLinkActive="active">📊 Dashboard</a></li>
          <li><a routerLink="policies" routerLinkActive="active">📋 Policies</a></li>
          <li><a routerLink="enrollments" routerLinkActive="active">📝 Enrollments</a></li>
          <li><a routerLink="claims" routerLinkActive="active">📄 Claims</a></li>
        </ul>
        <div class="user-info">
          <span class="user-name">{{ userName }}</span>
          <span class="user-role">Admin</span>
        </div>
        <button class="logout" (click)="logout()">🚪 Logout</button>
      </nav>
      <div class="main-area">
        <header class="topbar">
          <h2 class="page-title">Admin Panel</h2>
          <div class="topbar-right">
            <span class="welcome">Welcome, {{ userName }}</span>
          </div>
        </header>
        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout { display: flex; min-height: 100vh; }
    .sidebar { width: 240px; background: #1e293b; color: white; padding: 1.25rem; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; overflow-y: auto; }
    .brand { font-size: 1.3rem; font-weight: bold; margin-bottom: 2rem; padding: 0.5rem; border-bottom: 1px solid #334155; padding-bottom: 1rem; }
    .sidebar ul { list-style: none; padding: 0; margin: 0; flex: 1; }
    .sidebar li a { display: block; padding: 0.75rem 1rem; color: #cbd5e1; text-decoration: none; border-radius: 6px; margin-bottom: 0.25rem; transition: all 0.2s; font-size: 0.95rem; }
    .sidebar li a:hover { background: #334155; color: white; transform: translateX(4px); }
    .sidebar li a.active { background: #4f46e5; color: white; }
    .user-info { padding: 0.75rem; background: #334155; border-radius: 6px; margin-bottom: 0.75rem; }
    .user-name { display: block; font-weight: 600; font-size: 0.9rem; }
    .user-role { font-size: 0.75rem; color: #94a3b8; }
    .logout { padding: 0.7rem; background: #dc2626; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; transition: background 0.2s; }
    .logout:hover { background: #b91c1c; }
    .main-area { margin-left: 240px; flex: 1; display: flex; flex-direction: column; }
    .topbar { background: white; padding: 1rem 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.08); display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 10; }
    .page-title { font-size: 1.1rem; color: #333; margin: 0; }
    .topbar-right .welcome { font-size: 0.9rem; color: #666; }
    .content { flex: 1; padding: 2rem; background: #f8fafc; overflow-y: auto; }
  `]
})
export class AdminLayoutComponent {
  userName = '';

  constructor(private authService: AuthService) {
    const user = this.authService.getCurrentUser();
    this.userName = user?.fullName || 'Admin';
  }

  logout() { this.authService.logout(); }
}
