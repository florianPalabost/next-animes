import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnimesRoutingModule } from './animes-routing.module';
import {AnimesDetailComponent} from './animes-detail.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AnimesRoutingModule,
  ]
})
export class AnimesModule {}
