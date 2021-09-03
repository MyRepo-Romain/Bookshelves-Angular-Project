import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularSession } from 'app/angular.session';
import { UserResponse } from 'app/models/response/userResponse';
import firebase from 'firebase';
import { Subject } from 'rxjs';
import { DeleteUserAccountDialogComponent } from 'app/common/dialog/delete-user-account/delete.user.account.dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {

  public isLoaded: Subject<boolean>;

  public user: UserResponse;
  public userId: string;

  constructor(private session: AngularSession, private router: Router, public dialog: MatDialog) {
    this.isLoaded = new Subject();
   }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    firebase.auth().onAuthStateChanged(response => {
      if (response) {
        this.user = response;
        this.userId = response.uid;
        this.isLoaded.next(true);
      }
    });
  }

  deleteUserAndData() {
    this.dialog.open(DeleteUserAccountDialogComponent, { data: {
      userResponse: this.user,
      userId : this.userId
    }});
  }

}
