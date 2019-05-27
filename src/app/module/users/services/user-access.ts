import { User } from './user';
import { Observable } from 'rxjs';

export interface UserAccess {
  users(): Observable<User[]>;
  user(id: string): Observable<User>;
  toggleActive(id: string, isActive: boolean): Observable<boolean>;
}
