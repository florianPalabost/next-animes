import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AnimesService} from '../services/animes.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  genre: string;
  responseAnimes: any;
  links: any;
  animes: any = [];
  constructor(private router: ActivatedRoute, private animesService: AnimesService, private ngxService: NgxUiLoaderService) { }

  ngOnInit() {
    this.router.paramMap.subscribe(async params => {
      this.genre = params.get('genre');
      this.ngxService.start();
      this.responseAnimes = await this.animesService.retrieveAnimesWithGenre(this.genre);
      this.animes = this.responseAnimes.data;
      this.links = this.responseAnimes.links;

      console.log(this.links);
      this.ngxService.stop();
    });
  }

  async goNext(link: string) {
    this.ngxService.start();
    // todo refactor, put this code in the anime service (code between start & stop)
    const response = await this.animesService.getAnime(link);
    for (const anime of response.data) {
      anime.genres = await this.animesService.retrieveGenresAnime(anime.relationships?.genres?.links?.related);

      anime.image = anime?.attributes?.coverImage !== null ?
        anime?.attributes?.coverImage?.original :
        anime?.attributes?.posterImage?.original;
    }
    this.animes = [...this.animes, ...response.data];
    this.links = response.links;

    this.ngxService.stop();
  }

async onScroll(link) {
  console.log('scrolled!!', link);
  await this.goNext(link);
}
}
