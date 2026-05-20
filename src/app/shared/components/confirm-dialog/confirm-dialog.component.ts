import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overlay" *ngIf="visible" (click)="onCancel()">
      <div class="dialog" (click)="$event.stopPropagation()">
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
        <div class="actions">
          <button class="btn-confirm" (click)="onConfirm()">{{ confirmText }}</button>
          <button class="btn-cancel" (click)="onCancel()">Cancel</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .dialog { background: white; padding: 2rem; border-radius: 8px; width: 100%; max-width: 400px; }
    .dialog h3 { margin: 0 0 0.75rem; color: #333; }
    .dialog p { color: #666; margin: 0 0 1.5rem; }
    .actions { display: flex; gap: 0.5rem; justify-content: flex-end; }
    .actions button { padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9rem; }
    .btn-confirm { background: #dc2626; color: white; }
    .btn-confirm:hover { background: #b91c1c; }
    .btn-cancel { background: #e5e7eb; color: #333; }
    .btn-cancel:hover { background: #d1d5db; }
  `]
})
export class ConfirmDialogComponent {
  @Input() visible = false;
  @Input() title = 'Confirm';
  @Input() message = 'Are you sure?';
  @Input() confirmText = 'Confirm';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm() { this.confirmed.emit(); }
  onCancel() { this.cancelled.emit(); }
}

