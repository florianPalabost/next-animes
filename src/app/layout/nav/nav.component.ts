import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ModalGenresComponent} from '../../modal-genres/modal-genres.component';
import {AnimesService} from '../../services/animes.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  firstConnection = true;
  newTitle = '';
  url;
  genres = ['Comedy', 'Action', 'Adventure', 'Drama', 'Sci-Fi', 'Slice of Life', 'Space', 'Mystery', 'School', 'Magic', 'Supernatural', 'Police', 'Fantasy', 'Sports', 'Ecchi', 'Romance', 'Military', 'Samurai', 'Demons', 'Mecha', 'Racing', 'Cars', 'Horror', 'Psychological', 'Thriller', 'Martial Arts'];
  constructor(private dialog: MatDialog, private animesService: AnimesService) {
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

    this.animesService.subscriber$.subscribe((data: string) => {
      this.newTitle = data;
    });
  }

  onRegistered(registered: boolean) {
    this.firstConnection = !registered;
  }

  onNewAnime(newAnimeTitle: string) {
    this.newTitle = newAnimeTitle;
  }


  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
     genres: this.genres
    };
    this.dialog.open(ModalGenresComponent, dialogConfig);
  }
}
