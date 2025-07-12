import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface AlertMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertsSubject = new Subject<AlertMessage>();

  // Default durations in milliseconds
  private readonly DEFAULT_DURATIONS = {
    success: 5000,  // 5 seconds
    error: 7000,    // 7 seconds
    warning: 6000,  // 6 seconds
    info: 5000      // 5 seconds
  };

  constructor() {}

  /**
   * Observable para recibir alertas
   */
  get alerts$(): Observable<AlertMessage> {
    return this.alertsSubject.asObservable();
  }

  /**
   * Muestra un alert de éxito
   */
  showSuccess(message: string, title?: string, duration?: number): Observable<void> {
    const alert: AlertMessage = {
      id: Date.now().toString(),
      type: 'success',
      title: title || 'Éxito',
      message,
      duration: duration || this.DEFAULT_DURATIONS.success
    };

    this.alertsSubject.next(alert);

    return new Observable<void>(observer => {
      observer.next();
      observer.complete();
    });
  }

  /**
   * Muestra un alert de error
   */
  showError(message: string, title?: string, duration?: number): Observable<void> {
    const alert: AlertMessage = {
      id: Date.now().toString(),
      type: 'error',
      title: title || 'Error',
      message,
      duration: duration || this.DEFAULT_DURATIONS.error
    };

    this.alertsSubject.next(alert);

    return new Observable<void>(observer => {
      observer.next();
      observer.complete();
    });
  }

  /**
   * Muestra un alert de advertencia
   */
  showWarning(message: string, title?: string, duration?: number): Observable<void> {
    const alert: AlertMessage = {
      id: Date.now().toString(),
      type: 'warning',
      title: title || 'Advertencia',
      message,
      duration: duration || this.DEFAULT_DURATIONS.warning
    };

    this.alertsSubject.next(alert);

    return new Observable<void>(observer => {
      observer.next();
      observer.complete();
    });
  }

  /**
   * Muestra un alert de información
   */
  showInfo(message: string, title?: string, duration?: number): Observable<void> {
    const alert: AlertMessage = {
      id: Date.now().toString(),
      type: 'info',
      title: title || 'Información',
      message,
      duration: duration || this.DEFAULT_DURATIONS.info
    };

    this.alertsSubject.next(alert);

    return new Observable<void>(observer => {
      observer.next();
      observer.complete();
    });
  }

  /**
   * Muestra un alert personalizado
   */
  showAlert(type: 'success' | 'error' | 'warning' | 'info', message: string, title?: string, duration?: number): Observable<void> {
    const alert: AlertMessage = {
      id: Date.now().toString(),
      type,
      title: title || this.getDefaultTitle(type),
      message,
      duration: duration || this.DEFAULT_DURATIONS[type]
    };

    this.alertsSubject.next(alert);

    return new Observable<void>(observer => {
      observer.next();
      observer.complete();
    });
  }

  /**
   * Muestra un alert que no se cierra automáticamente
   */
  showPersistentAlert(type: 'success' | 'error' | 'warning' | 'info', message: string, title?: string): Observable<void> {
    const alert: AlertMessage = {
      id: Date.now().toString(),
      type,
      title: title || this.getDefaultTitle(type),
      message,
      duration: 0 // No auto-close
    };

    this.alertsSubject.next(alert);

    return new Observable<void>(observer => {
      observer.next();
      observer.complete();
    });
  }

  /**
   * Muestra un alert de confirmación
   */
  showConfirm(message: string, title?: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      const confirmed = confirm(`${title || 'Confirmar'}: ${message}`);
      observer.next(confirmed);
      observer.complete();
    });
  }

  /**
   * Obtiene el título por defecto según el tipo
   */
  private getDefaultTitle(type: 'success' | 'error' | 'warning' | 'info'): string {
    const titles = {
      success: 'Éxito',
      error: 'Error',
      warning: 'Advertencia',
      info: 'Información'
    };
    return titles[type];
  }
}
