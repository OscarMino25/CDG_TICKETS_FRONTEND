import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new BehaviorSubject<{ message: string, type: string } | null>(null);

  alert$ = this.alertSubject.asObservable();

  showAlert(message: string, type: 'success' | 'error' = 'success') {
    console.log('Mostrando alerta:', { message, type });  // Verifica que la alerta se está enviando
    this.alertSubject.next({ message, type });

    // Desaparecer la alerta después de 5 segundos
    setTimeout(() => {
      this.alertSubject.next(null);
    }, 3000);
  }

  clearAlert() {
    this.alertSubject.next(null);
  }
}
