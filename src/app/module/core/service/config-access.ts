import { InjectionToken } from '@angular/core';
import { makeStateKey } from '@angular/platform-browser';
import { Observable } from 'rxjs';

export interface ConfigAccess {
  apiUrl: Observable<string | undefined>;

  init(): Promise<string>;
}

export const CONFIG_SERVICE = new InjectionToken<ConfigAccess>('ConfigService');

