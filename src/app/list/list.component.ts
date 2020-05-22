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
      this.ngxService.start();
      if (!params.get('genre')) {
        if (params.get('title') !== '') {
          this.responseAnimes = await this.animesService.retrievesAnimes('title', params.get('title'));
        }
        else {
          if (params.get('genres') !== '' ) {
            this.responseAnimes = await this.animesService.retrievesAnimes('genres', params.get('genres'));
          }
        }
        this.animesService.emitUrl('animes/search');
      }
      else {
        if (params.get('genre') !== '') {
          this.genre = params.get('genre');
          this.responseAnimes = await this.animesService.retrievesAnimes('genres', this.genre);
        }
      }

      this.animes = this.responseAnimes?.data;
      this.links = this.responseAnimes?.links;

      this.ngxService.stop();
    });
  }

  async goNext(link: string) {
    this.ngxService.startBackground();
    // todo refactor, put this code in the anime service (code between start & stop)
    const response = await this.animesService.getAnime(link);
    await Promise.all(response?.data.map(async (anime) => {
      anime.genres = await this.animesService.retrieveGenresAnime(anime.relationships?.genres?.links?.related);
      anime.image = this.animesService.handleImageAnime(anime);
    }));

    this.animes = [...this.animes, ...response.data];
    this.links = response.links;

    this.ngxService.stopBackground();
  }

async onScroll(link) {
  await this.goNext(link);
}
}
