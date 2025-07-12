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
  showSuccess(message: string, title?: string): Observable<void> {
    const alert: AlertMessage = {
      id: Date.now().toString(),
      type: 'success',
      title: title || 'Éxito',
      message,
      duration: 5000
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
  showError(message: string, title?: string): Observable<void> {
    const alert: AlertMessage = {
      id: Date.now().toString(),
      type: 'error',
      title: title || 'Error',
      message,
      duration: 7000
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
  showWarning(message: string, title?: string): Observable<void> {
    const alert: AlertMessage = {
      id: Date.now().toString(),
      type: 'warning',
      title: title || 'Advertencia',
      message,
      duration: 6000
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
  showInfo(message: string, title?: string): Observable<void> {
    const alert: AlertMessage = {
      id: Date.now().toString(),
      type: 'info',
      title: title || 'Información',
      message,
      duration: 5000
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
}
