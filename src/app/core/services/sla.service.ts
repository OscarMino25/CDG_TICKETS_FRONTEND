import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Importar el servicio de autenticación

@Injectable({
  providedIn: 'root',
})
export class SlaService {
  private apiUrl = 'http://localhost:8000/api/slas';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Obtener encabezados de autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No hay token disponible. El usuario no está autenticado.');
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // Obtener todos los SLAs
  getSlas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // Obtener un SLA por ID
  getSlaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // Crear un nuevo SLA
  createSla(sla: any): Observable<any> {
    return this.http.post(this.apiUrl, sla, { headers: this.getAuthHeaders() });
  }

  // Actualizar un SLA
  updateSla(id: number, sla: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, sla, { headers: this.getAuthHeaders() });
  }

  // Eliminar un SLA
  deleteSla(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
