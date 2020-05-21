import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AnimesService} from '../services/animes.service';
import {UserService} from '../services/user.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {ActivatedRoute} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ModalYtVideoComponent} from '../modal-yt-video/modal-yt-video.component';

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
              private ngxService: NgxUiLoaderService, private router: ActivatedRoute,
              private dialog: MatDialog) { }

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
