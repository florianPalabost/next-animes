import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListComponent} from './list/list.component';
import {AnimesDetailComponent} from './animes-detail/animes-detail.component';
import {ListStatusComponent} from './list-status/list-status.component';

// todo gen animesList component to explorate alphabet order anime ?
const routes: Routes = [
  { path: 'animes/:title', component: AnimesDetailComponent},
  { path: 'animes/status/:status', component: ListStatusComponent},
  { path: 'animes/search/:title/:genres', component: ListComponent},
  { path: 'genres/:genre', component: ListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
