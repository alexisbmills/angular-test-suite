import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';
import { UserAccess } from './user-access';
import { CONFIG_SERVICE, ConfigAccess } from '../../core/service/config-access';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';

@Injectable()
export class UserApiService implements UserAccess {

  constructor(private http: HttpClient,
              @Inject(CONFIG_SERVICE) private config: ConfigAccess) {
  }

  users(): Observable<User[]> {
    return this.config.apiUrl.pipe(
      filter((apiUrl?: string) => apiUrl !== undefined),
      tap((apiUrl: string) => console.log(`fetching users ${apiUrl}/users`)),
      switchMap((apiUrl: string) => this.http.get<User[]>(`${apiUrl}/users`)),
      take(1)
    );
  }

  user(id: string): Observable<User> {
    return this.config.apiUrl.pipe(
      filter((apiUrl?: string) => apiUrl !== undefined),
      tap((apiUrl: string) => console.log(`fetching user ${apiUrl}/users/${id}`)),
      switchMap((apiUrl: string) => this.http.get<User>(`${apiUrl}/users/${id}`)),
      take(1)
    );
  }

  toggleActive(id: string, isActive: boolean): Observable<boolean> {
    return this.config.apiUrl.pipe(
      filter((apiUrl?: string) => apiUrl !== undefined),
      tap((apiUrl: string) => console.log(`change status of user ${apiUrl}/users/${id}`)),
      switchMap((apiUrl: string) => {
        return this.http.patch<boolean>(`${apiUrl}/users/${id}`, { isActive });
      }),
      tap(() => console.log(`changed status of user`)),
      map(() => true),
      take(1)
    );
  }
}
