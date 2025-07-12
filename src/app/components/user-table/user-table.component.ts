import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { User } from '../../models/user.model';
import { AlertService } from '../../services/alert.service';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css'],
  imports: [CommonModule, ConfirmDialogComponent],
  standalone: true
})
export class UserTableComponent implements OnChanges {
  @Input() users: User[] = [];
  @Input() isLoading: boolean = false;
  @Output() editUser = new EventEmitter<User>();
  @Output() deleteUser = new EventEmitter<string>();

  displayedColumns: string[] = ['name', 'email', 'age', 'phone', 'address', 'actions'];
  showConfirmDialog = false;
  userToDelete: User | null = null;
  confirmDialogTitle = '';
  confirmDialogMessage = '';

  constructor(private alertService: AlertService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Método implementado para OnChanges interface
  }

  onEdit(user: User): void {
    this.editUser.emit(user);
  }

  onDelete(user: User): void {
    this.userToDelete = user;
    this.confirmDialogTitle = 'Eliminar Usuario';
    this.confirmDialogMessage = `¿Estás seguro de que deseas eliminar al usuario "${user.name}"? Esta acción no se puede deshacer.`;
    this.showConfirmDialog = true;
  }

  onConfirmDelete(): void {
    if (this.userToDelete) {
      this.deleteUser.emit(this.userToDelete.id!);
      this.hideConfirmDialog();
    }
  }

  onCancelDelete(): void {
    this.hideConfirmDialog();
  }

  private hideConfirmDialog(): void {
    this.showConfirmDialog = false;
    this.userToDelete = null;
    this.confirmDialogTitle = '';
    this.confirmDialogMessage = '';
  }

  getAddressPreview(address: string): string {
    return address.length > 50 ? address.substring(0, 50) + '...' : address;
  }

  trackByUserId(index: number, user: User): string {
    return user.id || index.toString();
  }
}
