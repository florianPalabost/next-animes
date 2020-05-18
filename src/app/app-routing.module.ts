import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AnimesComponent} from "./animes/animes.component";

// todo gen animesList component to explorate alphabet order anime ?
const routes: Routes = [
  { path: 'animes', component: AnimesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
