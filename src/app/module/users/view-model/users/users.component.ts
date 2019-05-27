import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../services/user';
import { UserApiService } from '../../services/user-api.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit {

  private _users: Observable<User[]>;
  get users(): Observable<User[]> {
    return this._users;
  }

  constructor(private userApiService: UserApiService) {
  }

  ngOnInit(): void {
    this._users = this.userApiService.users();
  }

  rowClasses(index: number): { [key: string]: boolean } {
    return { odd: index % 2 === 0 };
  }

  activeClass(isActive: boolean) {
    return {
      inactive: !isActive
    };
  }
}
