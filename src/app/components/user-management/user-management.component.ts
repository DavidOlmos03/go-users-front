import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import { User, CreateUserRequest, UpdateUserRequest } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { UserTableComponent } from '../user-table/user-table.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { ParticlesBackgroundComponent } from '../matrix-background/matrix-background.component';
import { AlertWrapperComponent } from '../alert-wrapper/alert-wrapper.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  imports: [
    CommonModule,
    UserTableComponent,
    UserFormComponent,
    ParticlesBackgroundComponent,
    AlertWrapperComponent
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

  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) {}

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
    this.cdr.detectChanges(); // Forzar detección de cambios

    // Cargar usuarios directamente
    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.users = users;
          this.isLoading = false;
          this.cdr.detectChanges(); // Forzar detección de cambios
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.handleLoadError(error);
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
          this.alertService.showSuccess('Usuario creado exitosamente');
          this.loadUsers(); // Recargar la lista después de crear
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.errorMessage = 'Error al crear el usuario. Verifica los datos e intenta nuevamente.';
          this.alertService.showError('Error al crear el usuario. Verifica los datos e intenta nuevamente.');
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
          this.alertService.showSuccess('Usuario actualizado exitosamente');
          this.loadUsers(); // Recargar la lista después de actualizar
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.errorMessage = 'Error al actualizar el usuario. Verifica los datos e intenta nuevamente.';
          this.alertService.showError('Error al actualizar el usuario. Verifica los datos e intenta nuevamente.');
        }
      });
  }

  onDeleteUser(userId: string): void {
    this.userService.deleteUser(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('Usuario eliminado');
          this.alertService.showSuccess('Usuario eliminado exitosamente');
          this.loadUsers(); // Recargar la lista después de eliminar
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.errorMessage = 'Error al eliminar el usuario. Intenta nuevamente.';
          this.alertService.showError('Error al eliminar el usuario. Intenta nuevamente.');
        }
      });
  }

  private handleLoadError(error: any): void {
    let errorMessage = 'Error al cargar los usuarios.';

    if (error.message && error.message.includes('TimeoutError')) {
      errorMessage = 'La solicitud tardó demasiado en completarse. Verifica tu conexión.';
    } else if (error.message && error.message.includes('Servidor no disponible')) {
      errorMessage = 'No se puede conectar con el servidor. Verifica que la API esté ejecutándose en http://localhost:8080';
    } else if (error.status === 0) {
      errorMessage = 'No se puede conectar con el servidor. Verifica que la API esté ejecutándose en http://localhost:8080';
    } else if (error.status === 404) {
      errorMessage = 'Endpoint no encontrado. Verifica la URL de la API.';
    } else if (error.status >= 500) {
      errorMessage = 'Error del servidor. Intenta nuevamente más tarde.';
    }

    this.errorMessage = errorMessage;
    this.isLoading = false;
    this.alertService.showError(errorMessage);
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
