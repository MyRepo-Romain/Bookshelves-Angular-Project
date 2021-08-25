import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomFormValid } from 'app/core/custom.form.valid';
import { ErrorTypeHelper } from 'app/helpers/error.type.helper';
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

  public cfv: CustomFormValid;
  public user: UserResponse;
  public errorMessage: string;
  public userId: string;

  constructor(private session: AngularSession, public fb: FormBuilder, private router: Router, public dialog: MatDialog) {
    this.isLoaded = new Subject();

    this.cfv = new CustomFormValid(fb, ['name', 'photo', 'email', 'password']);
    this.cfv.name.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.name.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.photo.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingFileSelection);
    this.cfv.email.errors.push(ErrorTypeHelper.GLOBAL_ERROR.invalidEmail);
    this.cfv.email.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.email.errors.push(ErrorTypeHelper.SIGN_IN_ERROR.invalidAuth);
    this.cfv.email.errors.push(ErrorTypeHelper.FORGET_PASSWORD_ERROR.unknownEmail);
    this.cfv.email.errors.push(ErrorTypeHelper.CREATE_USER_ERROR.emailAlreadyUsed);
    this.cfv.password.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.password.errors.push(ErrorTypeHelper.SIGN_IN_ERROR.invalidAuth);
   }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    firebase.auth().onAuthStateChanged(response => {
      if(response) {
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
