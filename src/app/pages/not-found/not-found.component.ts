import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container">
      <div class="content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <a routerLink="/login" class="btn">← Back to Home</a>
      </div>
    </div>
  `,
  styles: [`
    .container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f8fafc; }
    .content { text-align: center; }
    h1 { font-size: 6rem; margin: 0; color: #4f46e5; font-weight: 800; }
    h2 { font-size: 1.5rem; margin: 0.5rem 0; color: #1e293b; }
    p { color: #64748b; margin: 1rem 0 2rem; }
    .btn { display: inline-block; padding: 0.75rem 1.5rem; background: #4f46e5; color: white; text-decoration: none; border-radius: 8px; font-size: 1rem; }
    .btn:hover { background: #4338ca; }
  `]
})
export class NotFoundComponent {}

