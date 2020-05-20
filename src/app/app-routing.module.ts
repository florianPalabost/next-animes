import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AnimesComponent} from './animes/animes.component';
import {ListComponent} from './list/list.component';
import {AnimesDetailComponent} from './animes/animes-detail/animes-detail.component';

// todo gen animesList component to explorate alphabet order anime ?
const routes: Routes = [
  { path: 'animes/:title', component: AnimesDetailComponent},
  { path: 'genres/:genre', component: ListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
