import { Component, OnInit } from '@angular/core';
import {AnimesService} from '../services/animes.service';
import {UserService} from '../services/user.service';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss']
})
export class RecommendationsComponent implements OnInit {
  animes: any = [];
  user: any;
  constructor(private dialogRef: MatDialogRef<RecommendationsComponent>, private animesService: AnimesService, private userService: UserService) { }

  async ngOnInit() {
    this.user = this.userService.retrieveUser();
    this.animes = await this.animesService.findRecommandations(this.user);
    console.log('comp animes', this.animes);
  }

  close() {
    this.dialogRef.close();
  }

  async reload() {
    this.animes = await this.animesService.findRecommandations(this.user, true);
  }
}
