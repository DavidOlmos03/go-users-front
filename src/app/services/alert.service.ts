import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() {}

  /**
   * Muestra un alert de éxito
   */
  showSuccess(message: string, title?: string): Observable<void> {
    return new Observable<void>(observer => {
      alert(`✅ ${title || 'Éxito'}: ${message}`);
      observer.next();
      observer.complete();
    });
  }

  /**
   * Muestra un alert de error
   */
  showError(message: string, title?: string): Observable<void> {
    return new Observable<void>(observer => {
      alert(`❌ ${title || 'Error'}: ${message}`);
      observer.next();
      observer.complete();
    });
  }

  /**
   * Muestra un alert de advertencia
   */
  showWarning(message: string, title?: string): Observable<void> {
    return new Observable<void>(observer => {
      alert(`⚠️ ${title || 'Advertencia'}: ${message}`);
      observer.next();
      observer.complete();
    });
  }

  /**
   * Muestra un alert de información
   */
  showInfo(message: string, title?: string): Observable<void> {
    return new Observable<void>(observer => {
      alert(`ℹ️ ${title || 'Información'}: ${message}`);
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
