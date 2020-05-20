import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  firstConnection = true;
  newTitle = '';
  url;
  constructor(private router: ActivatedRoute) {
  }
  widthScreen = window.innerWidth;
  ngOnInit(): void {
    this.url = window.location.pathname;

    switch (true) {
      case window.innerWidth <= 700:
        this.widthScreen = 25;
        break;
      case window.innerWidth > 700 && window.innerWidth <= 1000:
        this.widthScreen = 60;
        break;
    }
    if (localStorage.getItem('user') !== null) {
      this.firstConnection = false;
    }
  }

  onRegistered(registered: boolean) {
    this.firstConnection = !registered;
  }

  onNewAnime(newAnimeTitle: string) {
    this.newTitle = newAnimeTitle;
  }
}
