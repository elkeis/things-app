import { Injectable, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {decodeJwt} from 'jose';
import { actions } from '../store/session';

@Injectable({
  providedIn: 'root'
})
export class SessionService extends EventTarget{
  private static key = 'session';
  private access_token: string | undefined;

  private persist() {
    localStorage.setItem(SessionService.key, this.toString());
  }

  private load() {
    const serializedData = localStorage.getItem(SessionService.key);
    if (serializedData) {
      Object.assign(this, JSON.parse(serializedData));
    }
  }

  constructor(
    private store: Store
  ) {
    super();
    window.addEventListener('storage', () => {
      this.load();
      this.dispatchEvent(new Event('update'));
    });

    this.addEventListener('update', () => {
      const user  = this.getUser();
      if (!!user) {
        this.store.dispatch(actions.login({user}));
      }
    });

    this.load();
    this.dispatchEvent(new Event('update'));
  }

  getUser(): {name: string, avatar_url: string} | undefined {
    if (!this.access_token) return;
    const {
      name,
      avatar_url,
    } = decodeJwt(this.access_token) as {name: string, avatar_url: string};
    return {name, avatar_url};
  }

  setAuth(access_token?: string) {
    console.log(`access token set: ${access_token}`);
    this.access_token = access_token;
    this.persist();
    this.dispatchEvent(new Event('update'));
  }

  getAuth() {
    return this.access_token;
  }

  logOff() {
    this.setAuth();
  }

  override toString() {
    return JSON.stringify({
      access_token: this.access_token,
    })
  }
}
