import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserService} from './user.service';
import {Anime} from '../model/anime';
import {Subject} from 'rxjs';
import {User} from '../model/user';

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

    // test if anime already exist in localstorage

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

    anime = new Anime(anime);
    // save anime in user animes storage
    this.saveAnime(anime);
    return anime;

  }

  saveAnime(anime): void {
    const user = this.userService.retrieveUser();
    if (anime instanceof Anime) {
      user.animes.push(anime);
    }
    else {
      user.animes.push(new Anime(anime));
    }

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

  updateAnime(anime) {
    const user = this.userService.retrieveUser();
    let ctr = 0;
    user.animes.forEach((a, i) => {
      if (a.title === anime?.canonicalTitle ||  a.title === anime?.title) {
        ctr++;
        user.animes[i] = anime;
      }
    });
    if (ctr === 0 ) {
      user.animes.push(new Anime(anime));
    }
    localStorage.setItem('user', JSON.stringify(user));
  }

  retrieveLocal(title: string) {
    const user = this.userService.retrieveUser();
    const listAnimes =  user.animes.filter(a => {
      if (a.title === title) {
        return a;
      }
    });
    return listAnimes.length > 0 ? listAnimes : null;
  }

  retrieveLocalAnimesWithStatus(status: string, page: number) {
    const user = this.userService.retrieveUser();
    let field = null;
    const nbItemByPage = 3;

    switch (status) {
      case 'favorite':
        field = 'userLike';
        break;
      case 'watched':
        field = 'userWatched';
        break;
      case 'want-to-watch':
        field = 'userWantToWatch';
        break;
    }
    const list = user.animes.filter(a => {
      return a[field] === true;
    });
    page = (page + 1) * nbItemByPage;
    const max = list?.length;
    list.splice(page, max);
    return [list.length > 0 ? list : null, max];
  }

  async findRecommandations(user: User = null) {
    if (user !== null) {
      // get the genres of each animes & count each genres & class them & order
      const genres = this.getAnimesGenres(user.animes);

      // get top X
      const [first, second, third]: any = genres;
      console.log([first.el, second.el, third.el]);
      // find animes API with top X genres -> get 10 animes
      const resp = await this.retrievesAnimes('genres', [first.el, second.el, third.el].join());
      // pick 3 animes randomly
      const animes = this.pickRandom(3, resp?.data);
      // check if anime already exist
      animes.forEach(async (anime, ind) => {
        let alreadySeen = this.checkAlreadySeen(anime, user.animes);
        let i = 0;
        while (alreadySeen === true) {
          if (i > 10 ) {
            const idAnimeRand = this.getRandomNb(this.countAnime);
            const response = await this.getAnime(this.ANIMES_API_URL + '?page%5Blimit%5D=10&page%5Boffset%5D=' + idAnimeRand + '&filter[genres]=' + [first.el, second.el, third.el].join() + '&filter[subtype]=TV');
            animes[ind] = this.pickRandom(1, response.data);
          }
          else {
            animes[ind] = this.pickRandom(1, resp.data);
          }
          alreadySeen = this.checkAlreadySeen(anime, user.animes);
          i++;
        }

      });
      console.log('animes ?', animes);
      animes.forEach((a, index) => {
        animes[index] = new Anime(a);
      });
      return animes;

    }
    return [];
  }

  private getAnimesGenres(animes: Anime[]) {
    if (animes.length > 0) {
      // get the genres of each animes
      let genres = animes.map(a => {
        return a.genres;
      });
      genres = Array.prototype.concat.apply([], genres);

      // count each genres & claass/order them
      genres = this.countDuplicates(genres);

      genres.sort((a: any, b: any) => (b.count > a.count) ? 1 : ((a.count > b.count) ? -1 : 0));
      console.log('genres sort: ', genres);
      return genres;
    }
    return [];
  }

  countDuplicates(arr = []) {
    return arr.reduce((b, c) => ((b[b.findIndex(d => d.el === c)] || b[b.push({el: c, count: 0}) - 1]).count++, b), []);
  }

  pickRandom(n = 0, arr = []) {
    return arr.sort(() => Math.random() - Math.random()).slice(0, n);

  }
}


