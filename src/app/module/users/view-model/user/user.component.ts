import { Component, OnInit } from '@angular/core';
import { User } from '../../services/user';
import { ActivatedRoute } from '@angular/router';
import { UserApiService } from '../../services/user-api.service';
import { switchMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  private _state = {
    updateActive: false
  };
  get state(): {updateActive: boolean} {
    return this._state;
  }

  private _user: User;
  get user(): User {
    return this._user;
  }

  constructor(private route: ActivatedRoute, private userApiService: UserApiService) {
  }

  ngOnInit(): void {
    this._user = this.route.snapshot.data['user'];
  }

  toggleActive(isActive: boolean) {
    this._state = {...this._state, updateActive: true};
    this.userApiService
      .toggleActive(this._user.id, isActive)
      .pipe(
        switchMap(() => this.userApiService.user(this._user.id)),
        tap((updatedUser: User) => {
          this._user = updatedUser;
          this._state = {...this._state, updateActive: false};
        }),
        take(1)
      )
      .subscribe();
  }
}
