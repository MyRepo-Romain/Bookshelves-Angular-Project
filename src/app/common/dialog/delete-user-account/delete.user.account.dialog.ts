import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';
import { AngularSession } from 'app/angular.session';
import { FirestoreService } from 'app/core/firestore.service';
import { ErrorTypeHelper } from 'app/helpers/error.type.helper';
import { BookResponse } from 'app/models/response/bookResponse';
import { MagazineResponse } from 'app/models/response/magazineResponce';
import { MangaResponse } from 'app/models/response/mangaResponse';
import { NewspaperResponse } from 'app/models/response/newspaperResponce';
import { UserResponse } from 'app/models/response/userResponse';

export interface NewDeleteUserBag {
    userResponse: UserResponse;
    userId: string;
}

@Component({
    selector: 'delete-user-account-dialog',
    templateUrl: './delete.user.account.dialog.html',
    styleUrls: ['./delete.user.account.dialog.scss']
})
export class DeleteUserAccountDialogComponent  implements OnInit{

    public bookCollection: Array<BookResponse>;
    public mangaCollection: Array<MangaResponse>;
    public magazineCollection: Array<MagazineResponse>;
    public newspaperCollection: Array<NewspaperResponse>;
  
    public userId: string;
    public userPhoto: string;

    constructor(private session: AngularSession, private firestoreService: FirestoreService, private router: Router, public dialogRef: MatDialogRef<DeleteUserAccountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NewDeleteUserBag, public dialogService: MatDialog, public snackBar: MatSnackBar) {
      this.bookCollection = new Array();
      this.mangaCollection = new Array();
      this.magazineCollection = new Array();
      this.newspaperCollection = new Array();

    if (data.userResponse != undefined) {
        this.userId = data.userId;
        this.userPhoto = data.userResponse.photoURL;
      }
    }

    ngOnInit(): void {
      this.initialiazeDataSource();
    }

    initialiazeDataSource() {
        this.firestoreService.getAllBooks().subscribe((querySnapshot) => {
        this.bookCollection = querySnapshot.docs.map(dx => new BookResponse(dx)).filter(x => x.userId == this.userId);
        });
        this.firestoreService.getAllMangas().subscribe((querySnapshot) => {
        this.mangaCollection = querySnapshot.docs.map(dx => new MangaResponse(dx)).filter(x => x.userId == this.userId);
        });
        this.firestoreService.getAllMagazines().subscribe((querySnapshot) => {
        this.magazineCollection = querySnapshot.docs.map(dx => new MagazineResponse(dx)).filter(x => x.userId == this.userId);
        });
        this.firestoreService.getAllNewspapers().subscribe((querySnapshot) => {
        this.newspaperCollection = querySnapshot.docs.map(dx => new NewspaperResponse(dx)).filter(x => x.userId == this.userId);
        });
      }

  deleteUserData() {
    if (this.bookCollection != undefined || this.bookCollection.length != 0) {
      this.bookCollection.forEach(element => {
        this.firestoreService.deleteFile(element.photo)
      });
      this.firestoreService.deleteUserBook(this.userId);
    }

    if (this.mangaCollection != undefined || this.mangaCollection.length != 0) {
      this.mangaCollection.forEach(element => {
        this.firestoreService.deleteFile(element.photo).then( () => {
        this.firestoreService.deleteUserManga(this.userId);
        });
      });
    }

    if (this.magazineCollection != undefined || this.magazineCollection.length != 0) {
      this.magazineCollection.forEach(element => {
        this.firestoreService.deleteFile(element.photo).then( () => {
        this.firestoreService.deleteUserMagazine(this.userId);
        });
      });
    }

    if (this.newspaperCollection != undefined || this.newspaperCollection.length != 0) {
      this.newspaperCollection.forEach(element => {
        this.firestoreService.deleteFile(element.photo).then( () => {
        this.firestoreService.deleteUserNewpaper(this.userId);
        });
      });
    }
    this.deleteUserAccount();
  }

  deleteUserAccount() {
    this.firestoreService.deleteUserAccount(this.userPhoto).then(
      response => {
        this.close();
        this.session.clear();
        this.router.navigate(['signin']);
      },
      (error: any) => {
        if (error.code === "auth/requires-recent-login") {
          this.snackBar.open(ErrorTypeHelper.SNACK_BAR_DELETE.deleteAccountFail.msg, 'OK');
        }
      }
    );
  }

  close() {
    this.dialogRef.close(true);
  }

}
