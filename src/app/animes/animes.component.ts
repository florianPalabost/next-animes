import { Component, OnInit } from '@angular/core';
import {AnimesService} from '../services/animes.service';
import {UserService} from '../services/user.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-animes',
  templateUrl: './animes.component.html',
  styleUrls: ['./animes.component.scss']
})
export class AnimesComponent implements OnInit {
  user;
  anime;

  constructor(private animesService: AnimesService, private userService: UserService, private ngxService: NgxUiLoaderService) { }

  async ngOnInit() {
    this.ngxService.start();
    this.user = this.userService.retrieveUser();

    this.anime = await this.animesService.retrieveAnime();

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
    this.ngxService.stop();
  }

}
