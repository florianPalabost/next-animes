import { Component, OnInit } from '@angular/core';
import {AnimesService} from "../services/animes.service";

@Component({
  selector: 'app-animes',
  templateUrl: './animes.component.html',
  styleUrls: ['./animes.component.scss']
})
export class AnimesComponent implements OnInit {
  user;
  anime;

  constructor(private animesService: AnimesService) { }

  async ngOnInit() {
    this.user = await this.animesService.retrieveUser();
    console.log(this.user);
    // this.anime = await this.animesService.retrieveAnime();

  }

  updateStatusAnimeUser() {
    const btn = document.querySelector('#like');
    btn.getAttribute('class') !== 'mat-icon notranslate mat-warn material-icons' ?
    btn.setAttribute('class', 'mat-icon notranslate mat-warn material-icons'): null;

  }

}
