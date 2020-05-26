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
  recommendations: any = [];
  page = 0;
  animesYet = 0;
  max = 0;
  status = '';

  constructor(private router: ActivatedRoute, private animesService: AnimesService, private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.router.paramMap.subscribe(async params => {
      this.status = params.get('status');
      [this.animes, this.max] = this.animesService.retrieveLocalAnimesWithStatus(this.status, 0);
      this.animesService.emitUrl('animes/status');

      this.animesYet = this.max - this.animes?.length;
      //  max dont take the last entry so max += 1

      this.ngxService.stop();
    });
  }

  goNext() {
    this.ngxService.startBackground();
    this.page++;
    [this.animes, this.max] =  this.animesService.retrieveLocalAnimesWithStatus(this.status, this.page);
    this.animesYet = this.max - this.animes?.length;
    this.ngxService.stopBackground();
  }

  onScroll() {
    this.goNext();
  }

}
