import { Injectable } from '@angular/core';
import {User} from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user;
  constructor() { }

  async createUser(username: string) {
    const user = new User(username);
    await localStorage.setItem('user', JSON.stringify(user));
    this.user = user;
  }

  retrieveUser() {
    if (this.user === undefined) {
      this.user = JSON.parse(localStorage.getItem('user'));
    }
    return this.user;
  }

}
