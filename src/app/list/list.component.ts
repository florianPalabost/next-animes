import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AnimesService} from '../services/animes.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  genre: string;
  responseAnimes: any;
  links: any;
  animes: [];
  constructor(private router: ActivatedRoute, private animesService: AnimesService, private ngxService: NgxUiLoaderService) { }

  ngOnInit() {
    this.router.paramMap.subscribe(async params => {
      this.genre = params.get('genre');
      this.ngxService.start();
      this.responseAnimes = await this.animesService.retrieveAnimesWithGenre(this.genre);
      this.animes = this.responseAnimes.data;
      this.links = this.responseAnimes.links;
      this.ngxService.stop();
    });
  }

}
