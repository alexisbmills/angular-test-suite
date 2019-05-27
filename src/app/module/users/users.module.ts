import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UsersComponent } from './view-model/users/users.component';
import { UserComponent } from './view-model/user/user.component';
import { UserApiService } from './services/user-api.service';
import { UserResolver } from './services/user.resolver';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    pathMatch: 'full',
  },
  {
    path: '**',
    component: UserComponent,
    resolve: {
      user: UserResolver,
    },
    data: {
      noInitMetaData: true,
    },
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    UsersComponent,
    UserComponent
  ],
  providers: [
    UserApiService,
    UserResolver
  ],
})
export class UsersModule {
}
