import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AnimesService} from '../services/animes.service';
import {UserService} from '../services/user.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {ActivatedRoute} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ModalYtVideoComponent} from '../modal-yt-video/modal-yt-video.component';
import {Anime} from '../model/anime';

@Component({
  selector: 'app-animes-detail',
  templateUrl: './animes-detail.component.html',
  styleUrls: ['./animes-detail.component.scss']
})
export class AnimesDetailComponent implements OnInit {
  user;
  anime;
  userAnimeStatus;

  @Output() newAnime = new EventEmitter<string>();

  constructor(private animesService: AnimesService, private userService: UserService,
              private ngxService: NgxUiLoaderService, private router: ActivatedRoute,
              private dialog: MatDialog) { }

  async ngOnInit() {
    this.ngxService.start();
    this.user = this.userService.retrieveUser();

    this.router.paramMap.subscribe(async params => {
      const title = params.get('title');
      this.anime = title === null ? await this.animesService.retrieveAnime() :
        this.animesService.retrieveLocal(title) !==  null ? this.animesService.retrieveLocal(title)[0] :
          await this.animesService.retrievesAnimes('title', title).then(resp => {
            const anime = new Anime(resp.data[0]);
            this.animesService.saveAnime(anime);
            return anime;
          });
      this.animesService.emitTitle(this.anime?.attributes?.canonicalTitle || this.anime?.title || '');

    });

    this.ngxService.stop();
  }

  updateStatusAnimeUser(btnId: string) {
    const btn = document.querySelector('#' + btnId);
    btn.getAttribute('class') !== 'mat-icon notranslate mat-warn material-icons' ?
      btn.setAttribute('class', 'mat-icon notranslate mat-warn material-icons') : null;

    switch (btnId) {
      case 'like':
        this.anime.userLike = true;
        break;
      case 'watched':
        this.anime.userWatched = true;
        break;
      case 'want-to-watch':
        this.anime.userWantToWatch = true;
        break;
    }
    this.animesService.updateAnime(this.anime);

  }


  async nextAnime() {
    this.ngxService.start();
    this.anime = await this.animesService.retrieveAnime();
    this.animesService.emitTitle(this.anime?.title);

    this.ngxService.stop();
  }

  playVideoYT(youtubeVideoId: any) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
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
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.data = {
      ytVideoId: youtubeVideoId
    };

    this.dialog.open(ModalYtVideoComponent, dialogConfig);
  }
}
