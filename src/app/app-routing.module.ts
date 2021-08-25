import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { BookListComponent } from 'app/pages/book-list/book-list.component';
import { HomeComponent } from 'app/pages/home/home.component';
import { MagazineListComponent } from 'app/pages/magazine-list/magazine-list.component';
import { NewspaperListComponent } from 'app/pages/newspaper-list/newspaper-list.component';
import { SigninComponent } from 'app/pages/signin/signin.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { ProfilComponent } from 'app/pages/profil/profil.component';
import { UpdateProfilComponent } from 'app/pages/updateprofil/updateprofil.component';
import { MangaListComponent } from 'app/pages/manga-list/manga-list.component';

const redirectUnauthorizedToSignin = () => redirectUnauthorizedTo(['signin']);

const routes: Routes = [
  { path: 'signin', component: SigninComponent },
  { path: 'profil', canActivate: [AngularFireAuthGuard], component: ProfilComponent, data: { authGuardPipe: redirectUnauthorizedToSignin } },
  { path: 'updateprofil', canActivate: [AngularFireAuthGuard], component: UpdateProfilComponent, data: { authGuardPipe: redirectUnauthorizedToSignin } },
  { path: 'home', canActivate: [AngularFireAuthGuard], component: HomeComponent, data: { authGuardPipe: redirectUnauthorizedToSignin } },
  { path: 'books', canActivate: [AngularFireAuthGuard], component: BookListComponent, data: { authGuardPipe: redirectUnauthorizedToSignin } },
  { path: 'magazines', canActivate: [AngularFireAuthGuard], component: MagazineListComponent, data: { authGuardPipe: redirectUnauthorizedToSignin } },
  { path: 'newspapers', canActivate: [AngularFireAuthGuard], component: NewspaperListComponent, data: { authGuardPipe: redirectUnauthorizedToSignin } },
  { path: 'mangas', canActivate: [AngularFireAuthGuard], component: MangaListComponent, data: { authGuardPipe: redirectUnauthorizedToSignin } },
  { path: '', redirectTo: 'signin', pathMatch: 'full'},
  { path: '**', redirectTo: 'signin' },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
