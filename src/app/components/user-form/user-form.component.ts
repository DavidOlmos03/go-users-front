import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User, CreateUserRequest, UpdateUserRequest } from '../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() user: User | null = null;
  @Input() isEditing: boolean = false;
  @Output() formSubmit = new EventEmitter<CreateUserRequest | UpdateUserRequest>();
  @Output() formCancel = new EventEmitter<void>();

  userForm!: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    // Si ya tenemos datos de usuario al inicializar, cargarlos
    if (this.user && this.isEditing) {
      this.patchFormValues();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Solo actualizar si el formulario ya está inicializado
    if (this.userForm && changes['user'] && this.user && this.isEditing) {
      // console.log('Patching form with user data:', this.user);
      this.patchFormValues();
    }
  }

  private patchFormValues(): void {
    if (!this.userForm || !this.user) return;

    this.userForm.patchValue({
      name: this.user.name,
      email: this.user.email,
      age: this.user.age,
      phone: this.user.phone || '',
      address: this.user.address || ''
    });
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      phone: ['', [Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]], // Opcional
      address: ['', [Validators.minLength(10)]] // Opcional
    });

    // Si tenemos datos de usuario al inicializar el formulario, cargarlos
    if (this.user && this.isEditing) {
      setTimeout(() => {
        this.patchFormValues();
      }, 0);
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isLoading = true;
      const formData = this.userForm.value;

      if (this.isEditing && this.user) {
        this.formSubmit.emit(formData as UpdateUserRequest);
      } else {
        this.formSubmit.emit(formData as CreateUserRequest);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} es requerido`;
      }
      if (field.errors['email']) {
        return 'Email inválido';
      }
      if (field.errors['minlength']) {
        return `${this.getFieldDisplayName(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['min']) {
        return `${this.getFieldDisplayName(fieldName)} debe ser mayor a ${field.errors['min'].min}`;
      }
      if (field.errors['max']) {
        return `${this.getFieldDisplayName(fieldName)} debe ser menor a ${field.errors['max'].max}`;
      }
      if (field.errors['pattern']) {
        return `${this.getFieldDisplayName(fieldName)} tiene un formato inválido`;
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      name: 'Nombre',
      email: 'Email',
      age: 'Edad',
      phone: 'Teléfono',
      address: 'Dirección'
    };
    return fieldNames[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    if (!field) return false;

    // Para campos opcionales (phone, address), solo mostrar error si tienen valor pero es inválido
    if (fieldName === 'phone' || fieldName === 'address') {
      return !!(field.invalid && field.touched && field.value && field.value.trim() !== '');
    }

    return !!(field.invalid && field.touched);
  }
}
