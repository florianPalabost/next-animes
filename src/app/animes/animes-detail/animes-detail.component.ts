import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AnimesService} from '../../services/animes.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-animes-detail',
  templateUrl: './animes-detail.component.html',
  styleUrls: ['./animes-detail.component.scss']
})
export class AnimesDetailComponent implements OnInit {

  anime;
  title;

  @Output() newAnime = new EventEmitter<string>();

  constructor(private animesService: AnimesService, private router: ActivatedRoute, private ngxService: NgxUiLoaderService) { }

  async ngOnInit() {
    this.router.paramMap.subscribe(async params => {
      this.title = params.get('title');
      this.ngxService.start();
      this.anime = await this.animesService.retriveAnimeWithTitle(this.title);
      this.newAnime.emit(this.anime.attributes.canonicalTitle);
      this.ngxService.stop();
    });
  }

}
