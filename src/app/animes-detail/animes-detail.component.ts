import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AnimesService} from '../services/animes.service';
import {UserService} from '../services/user.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-animes-detail',
  templateUrl: './animes-detail.component.html',
  styleUrls: ['./animes-detail.component.scss']
})
export class AnimesDetailComponent implements OnInit {
  user;
  anime;

  @Output() newAnime = new EventEmitter<string>();

  constructor(private animesService: AnimesService, private userService: UserService,
              private ngxService: NgxUiLoaderService, private router: ActivatedRoute) { }

  async ngOnInit() {
    this.ngxService.start();
    this.user = this.userService.retrieveUser();

    this.router.paramMap.subscribe(async params => {
      const title = params.get('title');
      this.anime = title === null ? await this.animesService.retrieveAnime() : await this.animesService.retriveAnimeWithTitle(title);
      this.animesService.emitTitle(this.anime?.attributes?.canonicalTitle);
    });

    this.ngxService.stop();
  }

  updateStatusAnimeUser() {
    const btn = document.querySelector('#like');
    btn.getAttribute('class') !== 'mat-icon notranslate mat-warn material-icons' ?
      btn.setAttribute('class', 'mat-icon notranslate mat-warn material-icons') : null;

  }


  async nextAnime() {
    this.ngxService.start();
    this.anime = await this.animesService.retrieveAnime();
    this.animesService.emitTitle(this.anime?.attributes?.canonicalTitle);
    // console.log('next title', this.anime?.attributes?.canonicalTitle);
    this.ngxService.stop();
  }

}
