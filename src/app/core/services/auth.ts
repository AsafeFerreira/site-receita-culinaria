import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = "https://api-senai-angular.vercel.app/api";
  private readonly TOKEN_KEY = 'auth_token';

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl + "/auth/login", {email, password})
      .pipe(tap((res: any) => {
        localStorage.setItem(this.TOKEN_KEY, res?.token);
        localStorage.setItem('user_name', res?.name ?? email);
        localStorage.setItem('user_email', email);
      }))
  }

  cadastro(name: string, email: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl + "/auth/register", {name, email, password})
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    this.router.navigate(['login'])
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  isLoggenIn(): boolean {
    return !!this.getToken()
  }
}