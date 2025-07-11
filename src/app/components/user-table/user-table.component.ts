import { Component, Input, Output, EventEmitter } from '@angular/core';
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
export class UserTableComponent {
  @Input() users: User[] = [];
  @Input() isLoading: boolean = false;
  @Output() editUser = new EventEmitter<User>();
  @Output() deleteUser = new EventEmitter<string>();

  displayedColumns: string[] = ['name', 'email', 'age', 'phone', 'address', 'actions'];
  showConfirmDialog = false;
  userToDelete: string | null = null;

  constructor(private alertService: AlertService) {}

  onEdit(user: User): void {
    this.editUser.emit(user);
  }

  onDelete(userId: string): void {
    this.userToDelete = userId;
    this.showConfirmDialog = true;
  }

  onConfirmDelete(): void {
    if (this.userToDelete) {
      this.deleteUser.emit(this.userToDelete);
      this.hideConfirmDialog();
    }
  }

  onCancelDelete(): void {
    this.hideConfirmDialog();
  }

  private hideConfirmDialog(): void {
    this.showConfirmDialog = false;
    this.userToDelete = null;
  }

  getAddressPreview(address: string): string {
    return address.length > 50 ? address.substring(0, 50) + '...' : address;
  }

  trackByUserId(index: number, user: User): string {
    return user.id || index.toString();
  }
}
