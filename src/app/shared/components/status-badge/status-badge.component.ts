import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="badge" [ngClass]="'badge-' + status.toLowerCase()">{{ status | titlecase }}</span>`,
  styles: [`
    .badge { padding: 0.25rem 0.6rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; display: inline-block; }
    .badge-pending { background: #fef3c7; color: #92400e; }
    .badge-active { background: #d1fae5; color: #065f46; }
    .badge-approved { background: #d1fae5; color: #065f46; }
    .badge-under_review { background: #dbeafe; color: #1e40af; }
    .badge-rejected { background: #fee2e2; color: #991b1b; }
    .badge-cancelled { background: #fee2e2; color: #991b1b; }
    .badge-expired { background: #e5e7eb; color: #374151; }
    .badge-paid { background: #d1fae5; color: #065f46; }
    .badge-failed { background: #fee2e2; color: #991b1b; }
  `]
})
export class StatusBadgeComponent {
  @Input() status: string = '';
}

