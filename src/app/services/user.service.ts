import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, timeout } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { User, CreateUserRequest, UpdateUserRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/v1/users'; // Actualizado según la nueva ruta de la API
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  // Obtener todos los usuarios
  getUsers(): Observable<User[]> {
    return this.http.get<{ users: any[] }>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        timeout(10000), // 10 segundos de timeout
        map(response => response.users.map(this.apiToUser)),
        tap(users => this.usersSubject.next(users)),
        catchError(this.handleError)
      );
  }

  // Mapear respuesta de la API a modelo User
  private apiToUser(apiUser: any): User {
    return {
      id: apiUser.id,
      name: apiUser.name,
      email: apiUser.email,
      age: apiUser.age,
      phone: apiUser.phone,
      address: apiUser.address,
      createdAt: apiUser.created_at ? new Date(apiUser.created_at) : undefined,
      updatedAt: apiUser.updated_at ? new Date(apiUser.updated_at) : undefined,
    };
  }

  // Obtener un usuario por ID
  getUserById(id: string): Observable<User> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(map(this.apiToUser), catchError(this.handleError));
  }

  // Crear un nuevo usuario
  createUser(user: CreateUserRequest): Observable<User> {
    // Enviar el body tal cual lo recibe la API (sin transformar nombres)
    return this.http.post<any>(this.apiUrl, user, { headers: this.getHeaders() })
      .pipe(
        map(this.apiToUser),
        tap(newUser => {
          const currentUsers = this.usersSubject.value;
          this.usersSubject.next([...currentUsers, newUser]);
        }),
        catchError(this.handleError)
      );
  }

  // Actualizar un usuario
  updateUser(id: string, user: UpdateUserRequest): Observable<User> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, user, { headers: this.getHeaders() })
      .pipe(
        map(this.apiToUser),
        tap(updatedUser => {
          const currentUsers = this.usersSubject.value;
          const updatedUsers = currentUsers.map(u => u.id === id ? updatedUser : u);
          this.usersSubject.next(updatedUsers);
        }),
        catchError(this.handleError)
      );
  }

  // Eliminar un usuario
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        tap(() => {
          const currentUsers = this.usersSubject.value;
          const filteredUsers = currentUsers.filter(u => u.id !== id);
          this.usersSubject.next(filteredUsers);
        }),
        catchError(this.handleError)
      );
  }

  // Refrescar la lista de usuarios
  refreshUsers(): void {
    this.getUsers().subscribe();
  }

  // Verificar conectividad del servidor
  checkServerHealth(): Observable<boolean> {
    return this.http.get(`${this.apiUrl}`, { headers: this.getHeaders() })
      .pipe(
        timeout(5000),
        map(() => true),
        catchError(() => throwError(() => new Error('Servidor no disponible')))
      );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Error desconocido';

    if (error.name === 'TimeoutError') {
      errorMessage = 'La solicitud tardó demasiado en completarse. Verifica tu conexión.';
    } else if (error.status === 0) {
      errorMessage = 'No se puede conectar con el servidor. Verifica que la API esté ejecutándose.';
    } else if (error.status === 404) {
      errorMessage = 'Endpoint no encontrado.';
    } else if (error.status >= 500) {
      errorMessage = 'Error del servidor.';
    }

    return throwError(() => new Error(errorMessage));
  }
}
