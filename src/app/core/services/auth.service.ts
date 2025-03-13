
import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private LOGIN_URL = 'http://localhost:8000/api/login';
  private USER_URL = 'http://localhost:8000/api/me';
  private tokenKey = 'authToken';

  constructor(private httpClient: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<any> {
    return this.httpClient.post<any>(this.LOGIN_URL, { email, password }).pipe(
      tap({
        next: (response) => {
          if (response.token) {
            this.setToken(response.token);
          }
        },
        error: (error) => {
          console.error('Error en login:', error);
          throw error; // Esto permite que el componente capture el error en el subscribe
        }
      })
    );
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  public getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    } else {
      return null;
    }

  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;

      if (Date.now() >= exp) {
        this.logout(); // Forzar logout si el token ya expiró
        return false;
      }

      return true;
    } catch (error) {
      console.error('Token inválido. Cerrando sesión...');
      this.logout(); // Forzar logout si el token es inválido
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return new Observable(observer => observer.next(null));
    }
    return this.httpClient.get<any>(this.USER_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

}
