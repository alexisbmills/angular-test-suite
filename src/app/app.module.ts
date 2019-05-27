import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, Inject, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UsersModule } from './module/users/users.module';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from './module/core/core.module';
import { CONFIG_SERVICE, ConfigAccess } from './module/core/service/config-access';
import { BrowserConfigService } from './module/core/service/browser-config.service';
import { UserApiMockModule } from './module/user-api-mock/user-api-mock.module';
import { HttpClientModule } from '@angular/common/http';

export function configFactory(configService: ConfigAccess) {
  return () => configService.init();
}

const routes: Routes = [];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule.forRoot(),
    RouterModule.forRoot(routes),
    HttpClientModule,
    BrowserModule,
    UsersModule,
    UserApiMockModule.forRoot()
  ],
  providers: [
    { provide: CONFIG_SERVICE, useClass: BrowserConfigService },
    {
      provide: APP_INITIALIZER,
      useFactory: configFactory,
      deps: [
        [new Inject(CONFIG_SERVICE)]
      ],
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
