import { Component } from '@angular/core';
import { TuiAlertService } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert-wrapper',
  template: `
    <div>
      <!-- Este componente actúa como wrapper para los alerts -->
      <ng-content></ng-content>
    </div>
  `,
  imports: [CommonModule],
  standalone: true
})
export class AlertWrapperComponent {
  constructor(private alertService: TuiAlertService) {}
}
