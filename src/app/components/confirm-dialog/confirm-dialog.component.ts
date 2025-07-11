import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="modal-overlay fixed inset-0 flex items-center justify-center z-50" *ngIf="isVisible">
      <div class="modal-content rounded-lg p-8 max-w-md w-full mx-4 animate-fade-in">
        <div class="text-center">
          <!-- Icono de advertencia -->
          <div class="flex justify-center mb-4">
            <svg class="w-16 h-16 text-matrix-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>

          <!-- Título -->
          <h3 class="text-xl font-bold matrix-text mb-4">
            {{ title }}
          </h3>

          <!-- Mensaje -->
          <p class="text-gray-300 mb-6">
            {{ message }}
          </p>

          <!-- Botones -->
          <div class="flex space-x-4">
            <button
              (click)="onCancel()"
              class="flex-1 px-6 py-3 border border-matrix-blue text-matrix-blue rounded-lg hover:bg-matrix-blue hover:text-black transition-all duration-300 font-medium"
            >
              Cancelar
            </button>
            <button
              (click)="onConfirm()"
              class="flex-1 px-6 py-3 matrix-button rounded-lg font-medium"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  imports: [CommonModule],
  standalone: true
})
export class ConfirmDialogComponent {
  @Input() isVisible: boolean = false;
  @Input() title: string = 'Confirmar';
  @Input() message: string = '¿Estás seguro?';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
