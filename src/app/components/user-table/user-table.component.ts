import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class UserTableComponent {
  @Input() users: User[] = [];
  @Input() isLoading: boolean = false;
  @Output() editUser = new EventEmitter<User>();
  @Output() deleteUser = new EventEmitter<string>();

  displayedColumns: string[] = ['name', 'email', 'age', 'phone', 'address', 'actions'];

  onEdit(user: User): void {
    this.editUser.emit(user);
  }

  onDelete(userId: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.deleteUser.emit(userId);
    }
  }

  getAddressPreview(address: string): string {
    return address.length > 50 ? address.substring(0, 50) + '...' : address;
  }

  trackByUserId(index: number, user: User): string {
    return user.id || index.toString();
  }
}
