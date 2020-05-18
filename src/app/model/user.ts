import { v4 as uuidv4 } from 'uuid';

export class User {

  id: string;
  username: string;

  constructor(username: string) {
    this.id = uuidv4();
    this.username = username;
  }
}
