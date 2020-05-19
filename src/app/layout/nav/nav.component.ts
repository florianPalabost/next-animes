import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  firstConnection = true;
  newTitle = '';
  constructor() { }

  ngOnInit(): void {
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
