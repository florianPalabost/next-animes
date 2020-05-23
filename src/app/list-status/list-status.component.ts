import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AnimesService} from '../services/animes.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-list-status',
  templateUrl: './list-status.component.html',
  styleUrls: ['./list-status.component.scss']
})
export class ListStatusComponent implements OnInit {
  animes: any = [];
  page = 0;
  max = 0;
  status = '';

  constructor(private router: ActivatedRoute, private animesService: AnimesService, private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.router.paramMap.subscribe(async params => {
      this.status = params.get('status');
      console.log('status', this.status);
      [this.animes, this.max] = this.animesService.retrieveLocalAnimesWithStatus(this.status, 0);
      this.animesService.emitUrl('animes/status');
      // todo pagination

      // todo max dont take the last entry so max += 1
      console.log('max', this.max);
      console.log('animes', this.animes);
      this.ngxService.stop();
    });
  }

  async goNext() {
    this.ngxService.startBackground();
    const newAnimes = this.animesService.retrieveLocalAnimesWithStatus(this.status, this.page++);
    this.animes = newAnimes?.length > 0 ? [...this.animes, ...newAnimes] : this.animes;
    this.ngxService.stopBackground();
  }

  async onScroll() {
    await this.goNext();
  }

}
