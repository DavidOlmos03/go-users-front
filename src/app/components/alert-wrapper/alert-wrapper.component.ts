import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService, AlertMessage } from '../../services/alert.service';

@Component({
  selector: 'app-alert-wrapper',
  template: `
    <div class="alert-container">
      <!-- Alert Messages -->
      <div
        *ngFor="let alert of alerts; trackBy: trackByAlertId"
        class="alert-message"
        [class]="'alert-' + alert.type"
        [style.background]="alert.type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' :
                           alert.type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' :
                           alert.type === 'warning' ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                           'linear-gradient(135deg, #3b82f6, #2563eb)'"
        [style.border-left]="alert.type === 'success' ? '4px solid #047857' :
                             alert.type === 'error' ? '4px solid #b91c1c' :
                             alert.type === 'warning' ? '4px solid #b45309' :
                             '4px solid #1d4ed8'"
        style="position: fixed !important; top: 20px !important; right: 20px !important; z-index: 999999 !important; max-width: 400px !important; min-width: 300px !important; border-radius: 8px !important; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important; animation: slideIn 0.3s ease-out !important; backdrop-filter: blur(10px) !important; border: 1px solid rgba(255, 255, 255, 0.1) !important; pointer-events: auto !important; display: block !important; visibility: visible !important; opacity: 1 !important;"
      >
        <div class="alert-content" style="display: flex !important; align-items: flex-start !important; padding: 16px !important; color: white !important;">
          <div class="alert-icon" style="flex-shrink: 0 !important; margin-right: 12px !important; margin-top: 2px !important;">
            <svg *ngIf="alert.type === 'success'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <svg *ngIf="alert.type === 'error'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <svg *ngIf="alert.type === 'warning'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <svg *ngIf="alert.type === 'info'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="alert-text" style="flex: 1 !important; min-width: 0 !important;">
            <div class="alert-title" style="font-weight: 600 !important; font-size: 14px !important; margin-bottom: 4px !important; color: white !important;">{{ alert.title }}</div>
            <div class="alert-message-text" style="font-size: 13px !important; opacity: 0.9 !important; line-height: 1.4 !important; color: white !important;">{{ alert.message }}</div>
          </div>
          <button
            (click)="removeAlert(alert.id)"
            class="alert-close"
            type="button"
            style="flex-shrink: 0 !important; margin-left: 12px !important; padding: 4px !important; border-radius: 4px !important; opacity: 0.7 !important; transition: opacity 0.2s !important; background: transparent !important; border: none !important; cursor: pointer !important; color: white !important;"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <ng-content></ng-content>
    </div>
  `,
  imports: [CommonModule],
  standalone: true
})
export class AlertWrapperComponent implements OnInit, OnDestroy {
  alerts: AlertMessage[] = [];
  private destroy$ = new Subject<void>();

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    // Subscribe to alerts from the service
    this.alertService.alerts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(alert => {
        this.addAlert(alert);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private addAlert(alert: AlertMessage): void {
    this.alerts.push(alert);

    // Auto remove after duration
    if (alert.duration && alert.duration > 0) {
      setTimeout(() => {
        this.removeAlert(alert.id);
      }, alert.duration);
    }
  }

  removeAlert(id: string): void {
    this.alerts = this.alerts.filter(alert => alert.id !== id);
  }

  trackByAlertId(index: number, alert: AlertMessage): string {
    return alert.id;
  }
}
