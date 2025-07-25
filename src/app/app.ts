import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { UserManagementComponent } from './components/user-management/user-management.component';
import { ParticlesBackgroundComponent } from './components/matrix-background/matrix-background.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserTableComponent } from './components/user-table/user-table.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    UserManagementComponent,
    ParticlesBackgroundComponent,
    UserFormComponent,
    UserTableComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}
