import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {User} from "../model/user";

@Injectable({
  providedIn: 'root'
})
export class AnimesService implements OnInit, OnDestroy{

  user = null;
  ANIMES_API_URL = '';

  constructor() { }

  async ngOnInit() {
    // await this.createUser();
  }

  async createUser(username: string) {
    const user = new User(username);
    await localStorage.setItem('user', JSON.stringify(user));
    this.user = user;
  }

  async retrieveUser() {
    // if (this.user === null) {
    //   await this.createUser();
    // }
    return this.user;
  }

  ngOnDestroy(): void {
    localStorage.clear();
  }
 }
