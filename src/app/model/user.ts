import { v4 as uuidv4 } from 'uuid';
import {Anime} from './anime';

export class User {

  id: string;
  username: string;
  animes: Anime[];

  constructor(username: string) {
    this.id = uuidv4();
    this.username = username;
    this.animes = [];
  }
}
