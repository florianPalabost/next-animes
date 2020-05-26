import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListComponent} from './list/list.component';
import {RecommendationsComponent} from './recommendations/recommendations.component';
import {NoPageFoundComponent} from './layout/no-page-found/no-page-found.component';
import {AnimesDetailComponent} from './animes-detail/animes-detail.component';
import {
  AuthGardService as AuthGuard
} from './services/auth-gard.service';
import {RegisterComponent} from './register/register.component';

// todo gen animesList component to explorate alphabet order anime ?
const routes: Routes = [
  { path: '', component: AnimesDetailComponent, canActivate: [AuthGuard]},
  {
    path: 'animes', loadChildren: () => import('./animes-detail/animes.module').then(m => m.AnimesModule)

  },
  { path: 'recommendations', component: RecommendationsComponent},
  { path: 'genres/:genre', component: ListComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', component: NoPageFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
