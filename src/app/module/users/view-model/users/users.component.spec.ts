import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';

import { UsersComponent } from './users.component';
import { UserApiService } from '../../services/user-api.service';
import { UserApiMockModule } from '../../../user-api-mock/user-api-mock.module';
import { RouterTestingModule } from '@angular/router/testing';
import { CONFIG_SERVICE, ConfigAccess } from '../../../core/service/config-access';
import { ASYNC_MILLISECONDS } from '../../../user-api-mock/service/user-api-mock.service';
import { USERS_FIXTURES } from '../../../user-api-mock/service/user.fixtures';

export function configFactory(): ConfigAccess {
  return {
    apiUrl: new BehaviorSubject<string | undefined>('http://api'),
    init: () => Promise.resolve('http://api')
  };
}

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        UserApiMockModule.forRoot(),
      ],
      declarations: [
        UsersComponent,
      ],
      providers: [
        UserApiService,
        { provide: CONFIG_SERVICE, useFactory: configFactory },
        { provide: ASYNC_MILLISECONDS, useValue: 0 }
      ],
    })
      .overrideComponent(UsersComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('When displaying a list of users', () => {

    describe('Given a list of users', () => {

      it('Should display users', async(() => {
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          const listContainer = fixture.debugElement.query(By.css('.list'));
          const userList = fixture.debugElement.queryAll(By.css('.user'));
          expect(listContainer).toBeTruthy();
          expect(userList.length).toBe(6);
        });
      }));

      it('Should show inactive users', async(() => {
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          const inactiveUsers = fixture.debugElement.queryAll(By.css('.status.inactive'));
          expect(inactiveUsers.length).toBe(2);
        });
      }));

      it('Should show active users', async(() => {
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          const inactiveUsers = fixture.debugElement.queryAll(By.css('.status:not(.inactive)'));
          expect(inactiveUsers.length).toBe(4);
        });
      }));

      it('Should display user full name', async(() => {
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          const firstUser = fixture.debugElement.query(By.css('.user'));
          expect(firstUser.nativeElement.innerText).toContain('John');
        });
      }));

      it('Should provide a link to the user details', async(() => {
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          const viewLink = fixture.debugElement.query(By.css('.user a'));
          expect(viewLink.nativeElement.getAttribute('href')).toBe(`/${USERS_FIXTURES[0].id}`);
        });
      }));

    });
  });

});
