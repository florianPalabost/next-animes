import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AnimesDetailComponent} from './animes-detail.component';
import {ListStatusComponent} from '../list-status/list-status.component';
import {ListComponent} from '../list/list.component';

const routes: Routes = [
  { path: ':title', component: AnimesDetailComponent},
  { path: 'status/:status', component: ListStatusComponent},
  { path: 'search/:title/:genres', component: ListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnimesRoutingModule {}
