import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toasts" class="toast" [ngClass]="'toast-' + toast.type" (click)="dismiss(toast.id)">
        <span class="icon" *ngIf="toast.type === 'success'">✓</span>
        <span class="icon" *ngIf="toast.type === 'error'">✕</span>
        <span class="icon" *ngIf="toast.type === 'info'">ℹ</span>
        <span class="message">{{ toast.message }}</span>
      </div>
    </div>
  `,
  styles: [`
    .toast-container { position: fixed; top: 1rem; right: 1rem; z-index: 9999; display: flex; flex-direction: column; gap: 0.5rem; }
    .toast { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; border-radius: 6px; color: white; font-size: 0.9rem; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: slideIn 0.3s ease; min-width: 250px; }
    .toast-success { background: #16a34a; }
    .toast-error { background: #dc2626; }
    .toast-info { background: #2563eb; }
    .icon { font-weight: bold; font-size: 1.1rem; }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  `]
})
export class ToastContainerComponent {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {
    this.toastService.toasts.subscribe(t => this.toasts = t);
  }

  dismiss(id: number) { this.toastService.remove(id); }
}

