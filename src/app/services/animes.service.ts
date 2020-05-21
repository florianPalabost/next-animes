import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserService} from './user.service';
import {Anime} from '../model/anime';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimesService implements OnDestroy{

  countAnime = 0;
  ANIMES_API_URL = 'https://kitsu.io/api/edge/anime';

  observer = new Subject();
  public subscriber$ = this.observer.asObservable();

  urlObserver = new Subject();
  public urlSubscriber$ = this.urlObserver.asObservable();

  constructor(private http: HttpClient, private userService: UserService) { }

  ngOnDestroy(): void {
    localStorage.clear();
  }

  emitTitle(data) {
    this.observer.next(data);
  }

  emitUrl(data) {
    this.urlObserver.next(data);
  }

  async retrieveAnime() {
    let response;
    if (this.countAnime === 0) {
      response = await this.getAnime(this.ANIMES_API_URL);
      this.countAnime = response?.meta?.count;
    }
    else {
      const idRandom = this.getRandomNb(this.countAnime);
      response = await this.getAnime(this.ANIMES_API_URL + '?page%5Blimit%5D=10&page%5Boffset%5D=' + idRandom + '&subtype=TV');
    }

    // we get 1 random of the 10 items after call endpoints
    let idAnimeRand = this.getRandomNb(10);
    let anime = response.data[idAnimeRand];

    const user = this.userService.retrieveUser();

    let alreadySeen = this.checkAlreadySeen(anime, user.animes);
    let i = 0;
    while (alreadySeen === true) {
      if (i > 10 ) {
        idAnimeRand = this.getRandomNb(this.countAnime);
        response = await this.getAnime(this.ANIMES_API_URL + '?page%5Blimit%5D=10&page%5Boffset%5D=' + idAnimeRand + '&subtype=TV');
        anime = response.data[this.getRandomNb(10)];
      }
      else {
        idAnimeRand = this.getRandomNb(10);
        anime = response.data[idAnimeRand];
      }
      alreadySeen = this.checkAlreadySeen(anime, user.animes);
      i++;
    }
    // handle genres of anime
    anime.genres = await this.retrieveGenresAnime(anime.relationships?.genres?.links?.related);

    // handle img anime to show
    anime.image = anime?.attributes?.coverImage !== null ?
       anime?.attributes?.coverImage?.original :
       anime?.attributes?.posterImage?.original;

    // save anime in user animes storage
    this.saveAnime(anime);
    return anime;

  }

  saveAnime(anime): void {
    const user = this.userService.retrieveUser();
    user.animes.push(new Anime(anime));
    localStorage.setItem('user', JSON.stringify(user));
  }

  async getAnime(url = '') {
    return await this.http.get<any>(url).toPromise();
  }

  getRandomNb(max: number): number {
    return Math.floor(Math.random() * max);
  }

  checkAlreadySeen(anime = null, animes = []): boolean {
    let seen = false;
    animes.forEach(a => {
        if (a.title === anime.attributes.canonicalTitle) {
          seen = true;
        }
    });
    return seen;
  }

  async retrieveGenresAnime(link = '') {
    const genresResponse = await this.http.get<any>(link).toPromise();
    const genres = [];
    if (genresResponse?.data.length > 0) {
      genresResponse?.data.forEach(item => {
        genres.push(item?.attributes?.name);
      });
    }
    return genres;
  }

  async retrieveAnimesWithGenre(genre: string) {
    const animes = await this.getAnime(this.ANIMES_API_URL + '?filter[genres]=' + genre);
    for (const anime of animes.data) {
      anime.genres = await this.retrieveGenresAnime(anime.relationships?.genres?.links?.related);

      anime.image = anime?.attributes?.coverImage !== null ?
        anime?.attributes?.coverImage?.original :
        anime?.attributes?.posterImage?.original;
    }
    return animes;
  }

  async retriveAnimeWithTitle(title: string) {
     let anime = await this.getAnime(this.ANIMES_API_URL + '?filter[text]=' + title);
     anime = anime.data[0];
     anime.genres = await this.retrieveGenresAnime(anime.relationships?.genres?.links?.related);

     anime.image = anime?.attributes?.coverImage !== null ?
      anime?.attributes?.coverImage?.original :
      anime?.attributes?.posterImage?.original;
     return anime;
  }

  async retriveAnimesWithTitle(title: string) {
    const animes = await this.getAnime(this.ANIMES_API_URL + '?filter[text]=' + title);
    for (const anime of animes.data) {
      anime.genres = await this.retrieveGenresAnime(anime.relationships?.genres?.links?.related);
      anime.image = anime?.attributes?.coverImage !== null ?
        anime?.attributes?.coverImage?.original :
        anime?.attributes?.posterImage?.original;
    }
    return animes;
  }

  async retrieveAnimesWithGenres(genres: string) {
    const animes = await this.getAnime(this.ANIMES_API_URL + '?filter[genres]=' + genres);
    for (const anime of animes.data) {
      anime.genres = await this.retrieveGenresAnime(anime.relationships?.genres?.links?.related);

      anime.image = anime?.attributes?.coverImage !== null ?
        anime?.attributes?.coverImage?.original :
        anime?.attributes?.posterImage?.original;
    }
    return animes;
  }
}

