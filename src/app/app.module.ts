import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from 'app/app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ImporterMaterialModule } from 'app/core/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'environments/environment';
import { FirestoreService } from 'app/core/firestore.service';

import { AngularSession } from 'app/angular.session';

import { AppComponent } from 'app/app.component';
import { SigninComponent } from 'app/pages/signin/signin.component';
import { BookListComponent } from 'app/pages/book-list/book-list.component';
import { HeaderComponent } from 'app/common/header/header.component';
import { FileDownloaderComponent } from 'app/common/component/file-downloader/file-downloader.component';
import { NewBookDialogComponent } from 'app/common/dialog/upsert/new-book/new.book.dialog';
import { FooterCollapseComponent } from 'app/common/dialog/footer-collapse/footer-collapse.component';
import { MenuComponent } from 'app/common/menu/menu.component';
import { HomeComponent } from 'app/pages/home/home.component';
import { NewspaperListComponent } from 'app/pages/newspaper-list/newspaper-list.component';
import { MagazineListComponent } from 'app/pages/magazine-list/magazine-list.component';
import { UpdateProfilComponent } from 'app/pages/updateprofil/updateprofil.component';
import { ProfilComponent } from 'app/pages/profil/profil.component';
import { MangaListComponent } from 'app/pages/manga-list/manga-list.component';
import { NewMagazineDialogComponent } from 'app/common/dialog/upsert/new-magazine/new.magazine.dialog';
import { NewNewspaperDialogComponent } from 'app/common/dialog/upsert/new-newspaper/new.newspaper.dialog';
import { DateSelectComponent } from 'app/common/component/date-picker/date-picker.component';
import { NewMangaDialogComponent } from './common/dialog/upsert/new-manga/new.manga.dialog';
import { DeleteUserAccountDialogComponent } from './common/dialog/delete-user-account/delete.user.account.dialog';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    BookListComponent,
    NewBookDialogComponent,
    NewMagazineDialogComponent,
    NewNewspaperDialogComponent,
    NewMangaDialogComponent,
    DeleteUserAccountDialogComponent,
    HeaderComponent,
    FileDownloaderComponent,
    FooterCollapseComponent,
    MenuComponent,
    HomeComponent,
    NewspaperListComponent,
    MagazineListComponent,
    MangaListComponent,
    ProfilComponent,
    UpdateProfilComponent,
    DateSelectComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ImporterMaterialModule,
    FlexLayoutModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),

  ],
  providers: [
    AngularSession,
    FirestoreService,
    ],
  entryComponents: [
    NewBookDialogComponent,
    NewMagazineDialogComponent,
    NewNewspaperDialogComponent,
    NewMangaDialogComponent,
    DeleteUserAccountDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
