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

  // title observer
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
      response = await this.getAnime(this.ANIMES_API_URL + '?filter[subtype]=TV');
      this.countAnime = response?.meta?.count;
    }
    else {
      const idRandom = this.getRandomNb(this.countAnime);
      response = await this.getAnime(this.ANIMES_API_URL + '?page%5Blimit%5D=10&page%5Boffset%5D=' + idRandom + '&filter[subtype]=TV');
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
        response = await this.getAnime(this.ANIMES_API_URL + '?page%5Blimit%5D=10&page%5Boffset%5D=' + idAnimeRand + '&filter[subtype]=TV');
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
    anime.image = this.handleImageAnime(anime);

    // save anime in user animes storage
    this.saveAnime(anime);
    return anime;

  }

  saveAnime(anime): void {
    const user = this.userService.retrieveUser();
    user.animes.push(new Anime(anime));
    localStorage.setItem('user', JSON.stringify(user));
  }

  handleImageAnime(anime) {
    return anime?.attributes?.coverImage !== null ?
      anime?.attributes?.coverImage?.original :
      anime?.attributes?.posterImage?.original;
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

  /**
   * get animes from filters
   * @param type can be equal to title || genres
   * @param param value
   */
  async retrievesAnimes(type: string, param: string) {
    const link = type === 'title' ? this.ANIMES_API_URL + '?filter[text]=' + param :
      this.ANIMES_API_URL + '?filter[genres]=' + param + '&filter[subtype]=TV';

    const animes = await this.getAnime(link);
    await Promise.all(animes.data.map(async (anime) => {
      anime.genres = await this.retrieveGenresAnime(anime.relationships?.genres?.links?.related);
      anime.image = this.handleImageAnime(anime);
    }));
    return animes;
  }

}

