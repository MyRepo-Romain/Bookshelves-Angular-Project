import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomFormValid } from 'app/core/custom.form.valid';
import { FirestoreService } from 'app/core/firestore.service';
import { ErrorTypeHelper } from 'app/helpers/error.type.helper';
import { LoginRequest } from 'app/models/request/loginRequest';
import * as EmailValidator from 'email-validator';
import { AngularSession } from 'app/angular.session';
import { UserResponse } from 'app/models/response/userResponse';
import { SendEmailtDialogComponent } from 'app/common/dialog/send-email/send.email.dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  public inputUser = new LoginRequest(undefined);
  public cfv: CustomFormValid;
  public user: UserResponse;
  public isNewAccount: boolean;
  public errorMessage: string;

  constructor(private session: AngularSession, public fb: FormBuilder, private firestoreService: FirestoreService, private router: Router, public dialog: MatDialog) {
    this.session.clear();
    this.isNewAccount = false;

    this.cfv = new CustomFormValid(fb, ['name', 'email', 'password']);
    this.cfv.name.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.email.errors.push(ErrorTypeHelper.GLOBAL_ERROR.invalidEmail);
    this.cfv.email.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.email.errors.push(ErrorTypeHelper.SIGN_IN_ERROR.invalidAuth);
    this.cfv.email.errors.push(ErrorTypeHelper.FORGET_PASSWORD_ERROR.unknownEmail);
    this.cfv.email.errors.push(ErrorTypeHelper.CREATE_USER_ERROR.emailAlreadyUsed);
    this.cfv.password.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.password.errors.push(ErrorTypeHelper.SIGN_IN_ERROR.invalidAuth);
   }

  ngOnInit(): void {
  }

  isNewAccountFunction() {
    if(this.isNewAccount) {
      this.isNewAccount = false;
    } else {
      this.isNewAccount = true;
    }
  }

  validate() {

    if(this.inputUser.email == '' || this.inputUser.email == undefined) {
      this.cfv.invalid(this.cfv.email, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
      return false;
    }

    if(!EmailValidator.validate(this.inputUser.email)) {
        this.cfv.invalid(this.cfv.email, ErrorTypeHelper.GLOBAL_ERROR.invalidEmail.code);
        return false;
    }

    if(this.inputUser.password == '' || this.inputUser.password == undefined) {
        this.cfv.invalid(this.cfv.password, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
        return false;
    }

    this.login(!this.isNewAccount);
  }

  login(newAccount: boolean) {
    let request = newAccount ? this.firestoreService.signInUser(this.inputUser) : this.firestoreService.createNewUser(this.inputUser);
    request.then(
      response => {
        console.log(response)
        if(response.user.emailVerified == false) {
          this.firestoreService.verifyEmail().then(() => {
            this.dialog.open(SendEmailtDialogComponent, {data: {
              userEmail: this.inputUser.email,
              forgotPassword: false
            }});
          });
          this.isNewAccount = false;
        } else if(response.user.emailVerified == true) {
          this.session.setLogin();
          this.router.navigate(['home']);
        }
      },
      (error: any) => {
        if(error.code === "auth/email-already-in-use") {
          this.cfv.invalid(this.cfv.email, ErrorTypeHelper.CREATE_USER_ERROR.emailAlreadyUsed.code);
        } else if(error.code === "auth/user-not-found") {
          this.cfv.invalid(this.cfv.email, ErrorTypeHelper.FORGET_PASSWORD_ERROR.unknownEmail.code);
        } else {
          this.cfv.invalid(this.cfv.email, ErrorTypeHelper.SIGN_IN_ERROR.invalidAuth.code);
          this.cfv.invalid(this.cfv.password, ErrorTypeHelper.SIGN_IN_ERROR.invalidAuth.code);
        }
      }
    );
  }

  forgotPassword() {
    this.dialog.open(SendEmailtDialogComponent, {data: {
      forgotPassword: true
    }});
  }

}
