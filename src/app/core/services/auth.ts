import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { ApiResponse, AuthResponse, UserSession } from '../models/api.models';
import { environment } from '../../../environments/environment';

const STORAGE_KEY = 'warehouse-session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly sessionSignal = signal<UserSession | null>(this.restoreSession());

  readonly session = computed(() => this.sessionSignal());
  readonly isAuthenticated = computed(() => !!this.sessionSignal()?.accessToken);
  readonly isAdmin = computed(() => this.sessionSignal()?.role === 'ROLE_ADMIN');

  login(payload: { identifier: string; password: string }) {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/auth/login`, payload)
      .pipe(tap((response) => this.storeSession(response.data)));
  }

  register(payload: { username: string; email: string; password: string; role: string }) {
    return this.http.post<ApiResponse<null>>(`${environment.apiUrl}/auth/register`, payload);
  }

  forgotPassword(email: string) {
    const params = new HttpParams().set('email', email);
    return this.http.post<ApiResponse<string>>(`${environment.apiUrl}/auth/forgot-password`, null, { params });
  }

  resetPassword(token: string, password: string) {
    const params = new HttpParams().set('token', token).set('password', password);
    return this.http.post<ApiResponse<null>>(`${environment.apiUrl}/auth/reset-password`, null, { params });
  }

  logout() {
    localStorage.removeItem(STORAGE_KEY);
    this.sessionSignal.set(null);
    void this.router.navigate(['/login']);
  }

  accessToken() {
    return this.sessionSignal()?.accessToken ?? '';
  }

  role() {
    return this.sessionSignal()?.role ?? null;
  }

  private storeSession(auth: AuthResponse) {
    const session: UserSession = {
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken,
      role: auth.role as UserSession['role'],
      username: auth.username
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    this.sessionSignal.set(session);
  }

  private restoreSession(): UserSession | null {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as UserSession;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }
}
