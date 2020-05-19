import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AnimesService implements OnDestroy{

  countAnime = 0;
  ANIMES_API_URL = 'https://kitsu.io/api/edge/anime';

  constructor(private http: HttpClient) { }

  ngOnDestroy(): void {
    localStorage.clear();
  }

  async retrieveAnime() {
    let response;
    if (this.countAnime === 0) {
      response = await this.http.get(this.ANIMES_API_URL).toPromise();
    }
    else {
      const idRandom = Math.floor(Math.random() * this.countAnime);

      response = await this.http.get(this.ANIMES_API_URL + 'page%5Blimit%5D=10&page%5Boffset%5D=' + idRandom);
    }

    // we get 1 random of the 10 items after call endpoints
    const idAnimeRand = Math.floor(Math.random() * 10);
    const anime = response.data[idAnimeRand];

    // handle genre of anime
    anime.genres = [];
    const genresResponse = await this.http.get<any>(anime.relationships?.genres?.links?.related).toPromise();

    if (genresResponse?.data.length > 0) {
      genresResponse?.data.forEach(item => {
        anime.genres.push(item?.attributes?.name);
      });
    }

    // handle img anime to show
    anime?.attributes?.coverImage !== null ?
      anime.image = anime?.attributes?.coverImage?.original :
      anime.image = anime?.attributes?.posterImage?.original;

    return anime;

  }
 }
