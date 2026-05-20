<<<<<<< HEAD
=======
// filepath: c:\Users\2494394\Downloads\Interim Project Frontend\insure-frontend-master\src\app\pages\customer\customer-layout\customer-layout.component.ts
>>>>>>> New_UI
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="layout">
      <nav class="sidebar">
<<<<<<< HEAD
        <div class="brand">🏥 InsureHealth</div>
        <ul>
          <li><a routerLink="dashboard" routerLinkActive="active">📊 Dashboard</a></li>
          <li><a routerLink="policies" routerLinkActive="active">🔍 Browse Policies</a></li>
          <li><a routerLink="enrollments" routerLinkActive="active">📝 My Enrollments</a></li>
          <li><a routerLink="claims" routerLinkActive="active">📄 My Claims</a></li>
        </ul>
        <div class="user-info">
          <span class="user-name">{{ userName }}</span>
          <span class="user-role">Customer</span>
        </div>
        <button class="logout" (click)="logout()">🚪 Logout</button>
      </nav>
      <div class="main-area">
        <header class="topbar">
          <h2 class="page-title">Health Insurance Portal</h2>
          <div class="topbar-right">
            <span class="welcome">Welcome, {{ userName }}</span>
=======
        <div class="brand" routerLink="dashboard" style="cursor:pointer">
          <img src="logo.jpg" alt="InsureHealth" class="nav-logo">
          <span class="brand-text">InsureHealth</span>
        </div>


        <span class="menu-label">NAVIGATION</span>
        <ul>
          <li>
            <a routerLink="dashboard" routerLinkActive="active">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a routerLink="policies" routerLinkActive="active">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <span>Browse Policies</span>
            </a>
          </li>
          <li>
            <a routerLink="enrollments" routerLinkActive="active">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span>My Enrollments</span>
            </a>
          </li>
          <li>
            <a routerLink="claims" routerLinkActive="active">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/></svg>
              <span>My Claims</span>
            </a>
          </li>
        </ul>

        <div class="sidebar-bottom">
          <div class="user-card">
            <div class="user-avatar">{{ userInitial }}</div>
            <div class="user-details">
              <span class="user-name">{{ userName }}</span>
              <span class="user-role">Customer</span>
            </div>
          </div>
          <button class="logout-btn" (click)="logout()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out
          </button>
        </div>
      </nav>

      <div class="main-area">
        <header class="topbar">
          <div class="topbar-left">
            <h2 class="page-title">Health Insurance Portal</h2>
            <span class="page-subtitle">Manage your health coverage</span>
          </div>
          <div class="topbar-right">
            <div class="welcome-chip">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Welcome, <strong>{{ userName }}</strong>
            </div>
>>>>>>> New_UI
          </div>
        </header>
        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
<<<<<<< HEAD
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
=======
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600&family=DM+Sans:wght@400;500;600&family=Space+Grotesk:wght@700&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    .layout { display: flex; min-height: 100vh; font-family: 'Inter', sans-serif; }

    /* ── Sidebar ── */
    .sidebar {
      width: 248px; background: #0f172a;
      color: white; padding: 1.5rem 1rem;
      display: flex; flex-direction: column; gap: 0.5rem;
      position: fixed; top: 0; left: 0; bottom: 0;
      overflow-y: auto;
    }

    /* Brand */
    .brand { display: flex; align-items: center; gap: 0.6rem; padding-bottom: 1.25rem; border-bottom: 1px solid #1e293b; margin-bottom: 0.5rem; }
    .nav-logo { height: 32px; width: 32px; object-fit: contain; border-radius: 8px; flex-shrink: 0; }
    .brand-text { font-family: 'Poppins', sans-serif; font-size: 1.15rem; font-weight: 700; color: white; letter-spacing: -0.3px; }

    /* Menu label */
    .menu-label { font-family: 'DM Sans', sans-serif; font-size: 0.68rem; font-weight: 600; letter-spacing: 1.2px; color: #475569; text-transform: uppercase; padding: 0.25rem 0.75rem; }

    /* Nav links */
    .sidebar ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.2rem; }
    .sidebar li a {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.72rem 0.9rem; color: #94a3b8;
      text-decoration: none; border-radius: 10px;
      transition: all 0.2s;
      font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 500;
    }
    .sidebar li a span { flex: 1; }
    .sidebar li a:hover { background: #1e293b; color: #e2e8f0; transform: translateX(3px); }
    .sidebar li a.active { background: linear-gradient(135deg, #4f46e5, #6d28d9); color: white; box-shadow: 0 4px 12px rgba(79,70,229,0.35); }

    /* Bottom section */
    .sidebar-bottom { margin-top: auto; display: flex; flex-direction: column; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid #1e293b; }

    /* User card */
    .user-card { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: #1e293b; border-radius: 10px; }
    .user-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #4f46e5, #7c3aed); display: flex; align-items: center; justify-content: center; font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 0.95rem; color: white; flex-shrink: 0; }
    .user-details { display: flex; flex-direction: column; overflow: hidden; }
    .user-name { font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.85rem; color: #f1f5f9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .user-role { font-family: 'Inter', sans-serif; font-size: 0.7rem; color: #64748b; letter-spacing: 0.3px; }

    /* Logout */
    .logout-btn {
      display: flex; align-items: center; justify-content: center; gap: 0.5rem;
      padding: 0.65rem; background: transparent;
      color: #f87171; border: 1px solid #7f1d1d;
      border-radius: 10px; cursor: pointer;
      font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 600;
      transition: all 0.2s;
    }
    .logout-btn:hover { background: #7f1d1d; color: white; }

    /* ── Main Area ── */
    .main-area { margin-left: 248px; flex: 1; display: flex; flex-direction: column; }

    /* Topbar */
    .topbar {
      background: white; padding: 0.9rem 2rem;
      box-shadow: 0 1px 4px rgba(0,0,0,0.07);
      display: flex; justify-content: space-between; align-items: center;
      position: sticky; top: 0; z-index: 10;
    }
    .topbar-left { display: flex; flex-direction: column; gap: 0.1rem; }
    .page-title { font-family: 'Poppins', sans-serif; font-size: 1.1rem; font-weight: 700; color: #0f172a; letter-spacing: -0.3px; }
    .page-subtitle { font-family: 'Inter', sans-serif; font-size: 0.75rem; color: #94a3b8; font-weight: 400; }

    /* Welcome chip */
    .welcome-chip {
      display: flex; align-items: center; gap: 0.4rem;
      background: #f0f4ff; color: #4338ca;
      padding: 0.45rem 1rem; border-radius: 20px;
      font-family: 'Inter', sans-serif; font-size: 0.82rem; font-weight: 500;
    }
    .welcome-chip strong { font-family: 'DM Sans', sans-serif; font-weight: 700; }

    /* Content */
>>>>>>> New_UI
    .content { flex: 1; padding: 2rem; background: #f8fafc; overflow-y: auto; }
  `]
})
export class CustomerLayoutComponent {
  userName = '';
<<<<<<< HEAD
=======
  userInitial = '';
>>>>>>> New_UI

  constructor(private authService: AuthService) {
    const user = this.authService.getCurrentUser();
    this.userName = user?.fullName || 'Customer';
<<<<<<< HEAD
  }

  logout() { this.authService.logout(); }
}
=======
    this.userInitial = this.userName.charAt(0).toUpperCase();
  }

  logout() { this.authService.logout(); }
}
>>>>>>> New_UI
