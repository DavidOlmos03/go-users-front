import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User, CreateUserRequest, UpdateUserRequest } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { UserTableComponent } from '../user-table/user-table.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { MatrixBackgroundComponent } from '../matrix-background/matrix-background.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  imports: [
    CommonModule,
    UserTableComponent,
    UserFormComponent,
    MatrixBackgroundComponent
  ],
  standalone: true
})
export class UserManagementComponent implements OnInit, OnDestroy {
  users: User[] = [];
  isLoading = false;
  showForm = false;
  editingUser: User | null = null;
  isEditing = false;
  errorMessage = '';

  private destroy$ = new Subject<void>();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.users = users;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.errorMessage = 'Error al cargar los usuarios. Verifica que la API esté ejecutándose.';
          this.isLoading = false;
        }
      });
  }

  showCreateForm(): void {
    this.editingUser = null;
    this.isEditing = false;
    this.showForm = true;
  }

  showEditForm(user: User): void {
    this.editingUser = { ...user };
    this.isEditing = true;
    this.showForm = true;
  }

  hideForm(): void {
    this.showForm = false;
    this.editingUser = null;
    this.isEditing = false;
    this.errorMessage = '';
  }

  onSubmit(formData: CreateUserRequest | UpdateUserRequest): void {
    this.errorMessage = '';

    if (this.isEditing && this.editingUser) {
      this.updateUser(this.editingUser.id!, formData as UpdateUserRequest);
    } else {
      this.createUser(formData as CreateUserRequest);
    }
  }

  private createUser(userData: CreateUserRequest): void {
    this.userService.createUser(userData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newUser) => {
          console.log('Usuario creado:', newUser);
          this.hideForm();
          this.showSuccessMessage('Usuario creado exitosamente');
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.errorMessage = 'Error al crear el usuario. Verifica los datos e intenta nuevamente.';
        }
      });
  }

  private updateUser(userId: string, userData: UpdateUserRequest): void {
    this.userService.updateUser(userId, userData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedUser) => {
          console.log('Usuario actualizado:', updatedUser);
          this.hideForm();
          this.showSuccessMessage('Usuario actualizado exitosamente');
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.errorMessage = 'Error al actualizar el usuario. Verifica los datos e intenta nuevamente.';
        }
      });
  }

  onDeleteUser(userId: string): void {
    this.userService.deleteUser(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('Usuario eliminado');
          this.showSuccessMessage('Usuario eliminado exitosamente');
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.errorMessage = 'Error al eliminar el usuario. Intenta nuevamente.';
        }
      });
  }

  private showSuccessMessage(message: string): void {
    // Aquí podrías implementar un sistema de notificaciones
    console.log(message);
    // Por ahora solo recargamos los usuarios
    this.loadUsers();
  }

  refreshUsers(): void {
    this.loadUsers();
  }
}
