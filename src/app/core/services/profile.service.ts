import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private USER_URL = 'http://localhost:8000/api/me';
  private PROFILE_UPDATE_URL = 'http://localhost:8000/api/me';  // API para actualizar perfil
  private CHANGE_PASSWORD_URL = 'http://localhost:8000/api/change-password';  // API para cambiar contraseña
  private tokenKey = 'authToken';

  constructor(private httpClient: HttpClient) { }

  // Obtiene el perfil del usuario
  getUserProfile(): Observable<any> {
    const token = localStorage.getItem(this.tokenKey);
    return this.httpClient.get<any>(this.USER_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap(response => {
        console.log(response);  // Aquí puedes ver si "roles" está llegando correctamente
      })
    );
  }

  // Actualiza los datos del perfil
  updateProfile(data: any): Observable<any> {
    const token = localStorage.getItem(this.tokenKey);
    return this.httpClient.put<any>(this.PROFILE_UPDATE_URL, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Cambiar la contraseña del usuario
changePassword(data: any): Observable<any> {
  const token = localStorage.getItem(this.tokenKey);

  // Mapear los campos correctamente
  const passwordData = {
    current_password: data.current_password, // Mantener nombres exactos del backend
    new_password: data.new_password, // Mantener nombres exactos del backend
    new_password_confirmation: data.new_password_confirmation // Mantener nombres exactos del backend
  };

  return this.httpClient.put<any>(this.CHANGE_PASSWORD_URL, passwordData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
}
