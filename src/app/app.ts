import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { MatrixBackgroundComponent } from './components/matrix-background/matrix-background.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserTableComponent } from './components/user-table/user-table.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    UserManagementComponent,
    MatrixBackgroundComponent,
    UserFormComponent,
    UserTableComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = 'Sistema de Usuarios Matrix';
}
