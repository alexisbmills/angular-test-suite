import { Injectable } from '@angular/core';
import { ConfigAccess } from './config-access';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

export interface BrowserConfig {
  apiUrl: string;
}

@Injectable()
export class BrowserConfigService implements ConfigAccess {

  private _apiUrl = new BehaviorSubject<string|undefined>(undefined);

  constructor(private httpClient: HttpClient) {
  }

  get apiUrl(): Observable<string> {
    return this._apiUrl.asObservable();
  }

  init(): Promise<string> {
    return this.httpClient
      .get('/assets/config.json')
      .pipe(
        map((config: BrowserConfig): string => config.apiUrl),
        tap((url: string) => {
          this._apiUrl.next(url);
          console.log(`getting API URL from JSON ${url}`);
        })
      )
      .toPromise();
  }
}
