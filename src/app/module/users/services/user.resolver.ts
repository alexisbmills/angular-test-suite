import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { User } from './user';
import { UserApiService } from './user-api.service';

@Injectable()
export class UserResolver implements Resolve<User | undefined> {

  constructor(private userApiService: UserApiService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    const urlPart = route.url.join('');
    return this.userApiService.user(urlPart);
  }
}
