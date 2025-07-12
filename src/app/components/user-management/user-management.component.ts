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
    this.cdr.detectChanges();

    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.users = users;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
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
          this.hideForm();
          this.alertService.showSuccess(
            `Usuario "${userData.name}" ha sido creado exitosamente`,
            'Usuario Creado'
          );
          // Recargar la lista después de crear
          setTimeout(() => {
            this.loadUsers();
          }, 500);
        },
        error: (error) => {
          this.errorMessage = 'Error al crear el usuario. Verifica los datos e intenta nuevamente.';
          this.alertService.showError(
            'No se pudo crear el usuario. Verifica que todos los campos requeridos estén completos y que el email no esté duplicado.',
            'Error al Crear Usuario'
          );
        }
      });
  }

  private updateUser(userId: string, userData: UpdateUserRequest): void {
    // Find the user to get their name for the success message
    const userToUpdate = this.users.find(user => user.id === userId);
    const userName = userToUpdate?.name || 'Usuario';

    this.userService.updateUser(userId, userData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedUser) => {
          this.hideForm();
          this.alertService.showSuccess(
            `Usuario "${userName}" ha sido actualizado exitosamente`,
            'Usuario Actualizado'
          );
          // Recargar la lista después de actualizar
          setTimeout(() => {
            this.loadUsers();
          }, 500);
        },
        error: (error) => {
          this.errorMessage = 'Error al actualizar el usuario. Verifica los datos e intenta nuevamente.';
          this.alertService.showError(
            'No se pudo actualizar el usuario. Verifica que todos los campos requeridos estén completos y que el email no esté duplicado.',
            'Error al Actualizar Usuario'
          );
        }
      });
  }

  onDeleteUser(userId: string): void {
    // Find the user to get their name for the success message
    const userToDelete = this.users.find(user => user.id === userId);
    const userName = userToDelete?.name || 'Usuario';

    this.userService.deleteUser(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.alertService.showSuccess(
            `El usuario "${userName}" ha sido eliminado exitosamente`,
            'Usuario Eliminado'
          );
          // Recargar la lista después de eliminar
          setTimeout(() => {
            this.loadUsers();
          }, 500);
        },
        error: (error) => {
          this.errorMessage = 'Error al eliminar el usuario. Intenta nuevamente.';
          this.alertService.showError(
            `No se pudo eliminar al usuario "${userName}". Intenta nuevamente más tarde.`,
            'Error al Eliminar Usuario'
          );
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
    this.alertService.showError(
      errorMessage,
      'Error al Cargar Usuarios'
    );
  }

  refreshUsers(): void {
    this.loadUsers();
  }
}
