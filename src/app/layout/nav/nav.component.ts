import {AfterContentChecked, AfterViewInit, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ModalGenresComponent} from '../../modal-genres/modal-genres.component';
import {AnimesService} from '../../services/animes.service';
import {RecommendationsComponent} from '../../recommendations/recommendations.component';
import {Subject} from 'rxjs';
import {MatSidenav} from '@angular/material/sidenav';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, AfterViewInit {
  firstConnection = true;
  newTitle = '';
  url;
  opened = true;
  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;


  genres = ['Comedy', 'Action', 'Adventure', 'Drama', 'Sci-Fi', 'Slice of Life', 'Space', 'Mystery', 'School', 'Magic', 'Supernatural', 'Police', 'Fantasy', 'Sports', 'Ecchi', 'Romance', 'Military', 'Samurai', 'Demons', 'Mecha', 'Racing', 'Cars', 'Horror', 'Psychological', 'Thriller', 'Martial Arts'];
  constructor(private dialog: MatDialog, private animesService: AnimesService) {
  }
  widthScreen = window.innerWidth;

  ngOnInit(): void {
    if (window.innerWidth < 768) {
      this.sidenav.fixedTopGap = 55;
      this.opened = false;
    } else {
      this.sidenav.fixedTopGap = 55;
      this.opened = true;
    }
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
    // need to async/await because ExpressionChangedAfterItHasBeenCheckedError else
    this.animesService.subscriber$.subscribe(async (data: string) => {
      this.newTitle = await data;
    });
    this.animesService.urlSubscriber$.subscribe(async (data: string) => {
      this.url = await data;
    });
  }

  ngAfterViewInit() {


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
    dialogConfig.width = '500px';
    dialogConfig.height = '500px';
    this.dialog.open(ModalGenresComponent, dialogConfig);
  }

  openRecommandationsDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    let relativeWidth = (window.innerWidth * 80) / 100;
    if (window.innerWidth > 1500) {
      relativeWidth = (1500 * 80 ) / 100;
    } else {
      relativeWidth = (window.innerWidth * 80 ) / 100;
    }

    const relativeHeight = (relativeWidth * 9) / 16 + 120; // 16:9 to which we add 120 px for the dialog action buttons ("close")
    dialogConfig.width = relativeWidth + 'px';
    dialogConfig.height = relativeHeight + 'px';
    this.dialog.open(RecommendationsComponent, dialogConfig);
  }

  snavToggle(snav) {
    snav.toggle();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < 768) {
      this.sidenav.fixedTopGap = 55;
      this.opened = false;
    } else {
      this.sidenav.fixedTopGap = 55;
      this.opened = true;
    }
  }

  isBiggerScreen() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return width < 768;
  }
}
