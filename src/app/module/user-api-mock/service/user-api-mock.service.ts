import { Inject, Injectable, InjectionToken, OnDestroy, Optional } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import { USERS_FIXTURES } from './user.fixtures';
import { delay, dematerialize, map, materialize, mergeMap, scan, take, takeUntil, tap } from 'rxjs/operators';
import { User } from '../../users/services/user';

export const ASYNC_MILLISECONDS = new InjectionToken<number>('ASYNC_MILLISECONDS');

@Injectable()
export class UserApiMockService implements HttpInterceptor, OnDestroy {

  private fixtures: BehaviorSubject<User[]> = new BehaviorSubject(USERS_FIXTURES);

  private destroyed: Subject<boolean> = new Subject();

  constructor(@Optional() @Inject(ASYNC_MILLISECONDS) private asyncMilliseconds = 500) {
    this.fixtures
      .pipe(
        takeUntil(this.destroyed)
      )
      .subscribe();
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // wrap in delayed observable to simulate server api call
    return of(null)
      .pipe(mergeMap(() => {
        if (request.url.match(/\/api\/users\/([a-z0-9\\-]+)$/i) && request.method === 'GET') {
          console.log('loaded from fixture: ' + request.url);
          const userId = request.url.match(/\/api\/users\/([a-z0-9\\-]+)$/i)[1];
          return this.fixtures.pipe(
            map((users: User[]) => {
              const body = users.find((user: User) => user.id === userId);
              return new HttpResponse({ status: body ? 200 : 404, body });
            }),
            take(1)
          );
        }
        if (request.url.match(/\/api\/users$/i) && request.method === 'GET') {
          console.log('loaded from fixture: ' + request.url);
          return this.fixtures.pipe(
            map((body: User[]) => {
              return new HttpResponse({ status: 200, body });
            }),
            take(1)
          );
        }
        if (request.url.match(/\/api\/users\/([a-z0-9\\-]+)$/i) && request.method === 'PATCH') {
          console.log('updating fixture: ' + request.url);
          const userId = request.url.match(/\/api\/users\/([a-z0-9\\-]+)$/i)[1];
          const isActive = request.body.isActive;
          if (isActive === undefined) {
            return of(new HttpResponse({ status: 422 }));
          }
          return this.fixtures.pipe(
            take(1),
            map((users: User[]): {
              users: User[],
              wasUpdated: boolean
            } => {
              const update = {
                users: [],
                wasUpdated: false
              };

              return users.reduce((usersUpdate, user) => {
                if (user.id === userId) {
                  user.isActive = !!isActive;
                  return { users: [...usersUpdate.users, user], wasUpdated: true };
                }
                return { ...usersUpdate, users: [...usersUpdate.users, user] };

              }, update);
            }),
            tap((updateResult: {
              users: User[],
              wasUpdated: boolean
            }) => {
              console.log(updateResult)
              this.fixtures.next(updateResult.users);
            }),
            map((updateResult: {
              users: User[],
              wasUpdated: boolean
            }) => new HttpResponse({ status: updateResult.wasUpdated ? 204 : 404 })),
            take(1)
          );
        }
        console.log('loaded from http call:' + request.url);
        return next.handle(request);
      }))
      // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
      .pipe(materialize())
      .pipe(delay(this.asyncMilliseconds))
      .pipe(dematerialize());
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
    this.destroyed.complete();
  }
}
