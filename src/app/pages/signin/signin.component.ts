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
import { environment } from 'environments/environment';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  public loginRequest: LoginRequest;
  public cfv: CustomFormValid;
  public user: UserResponse;
  public isNewAccount: boolean;
  public newEmail: string;
  public newPassword: string;

  constructor(private session: AngularSession, public fb: FormBuilder, private firestoreService: FirestoreService, private router: Router, public dialog: MatDialog) {
    this.session.clear();
    this.isNewAccount = false;
    this.loginRequest = new LoginRequest(undefined);

    this.cfv = new CustomFormValid(fb, ['email', 'password', 'newEmail', 'newPassword']);
    this.cfv.newEmail.errors.push(ErrorTypeHelper.GLOBAL_ERROR.invalidEmail);
    this.cfv.newEmail.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.newEmail.errors.push(ErrorTypeHelper.GLOBAL_ERROR.invalidEmail);
    this.cfv.newEmail.errors.push(ErrorTypeHelper.CREATE_USER_ERROR.emailAlreadyUsed);

    this.cfv.email.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.email.errors.push(ErrorTypeHelper.SIGN_IN_ERROR.invalidAuth);
    this.cfv.email.errors.push(ErrorTypeHelper.FORGET_PASSWORD_ERROR.unknownEmail);
    this.cfv.email.errors.push(ErrorTypeHelper.CREATE_USER_ERROR.emailAlreadyUsed);

    this.cfv.password.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.password.errors.push(ErrorTypeHelper.SIGN_IN_ERROR.invalidAuth);

    this.cfv.newPassword.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.newPassword.errors.push(ErrorTypeHelper.GLOBAL_ERROR.toWeakPassword);
   }

  ngOnInit(): void {
  }

  isNewAccountFunction() {
    this.isNewAccount = !this.isNewAccount;
    this.newEmail = '';
    this.newPassword = '';
  }

  validate() {

    if (this.isNewAccount == false) {
      if (this.loginRequest.email == '' || this.loginRequest.email == undefined) {
        this.cfv.invalid(this.cfv.email, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
        return false;
      }
  
      if (!EmailValidator.validate(this.loginRequest.email)) {
          this.cfv.invalid(this.cfv.email, ErrorTypeHelper.GLOBAL_ERROR.invalidEmail.code);
          return false;
      }

      if (this.loginRequest.password == '' || this.loginRequest.password == undefined) {
        this.cfv.invalid(this.cfv.password, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
        return false;
      }
    } else {
      if (this.newEmail == '' || this.newEmail == undefined) {
        this.cfv.invalid(this.cfv.newEmail, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
        return false;
      }
  
      if (!EmailValidator.validate(this.newEmail)) {
        this.cfv.invalid(this.cfv.newEmail, ErrorTypeHelper.GLOBAL_ERROR.invalidEmail.code);
        return false;
      }

      if (this.newPassword == '' || this.newPassword == undefined) {
        this.cfv.invalid(this.cfv.newPassword, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
        return false;
      }

      if (!environment.passwordRegex.test(this.newPassword)) {
        this.cfv.invalid(this.cfv.newPassword, ErrorTypeHelper.GLOBAL_ERROR.toWeakPassword.code);
        return false;
      }

      this.loginRequest.email = this.newEmail;
      this.loginRequest.password = this.newPassword;
    }

    this.login(!this.isNewAccount);
  }

  login(isNewAccount: boolean) {
    let request = isNewAccount ? this.firestoreService.signInUser(this.loginRequest) : this.firestoreService.createNewUser(this.loginRequest);
    request.then(
      response => {
        if (response.user.emailVerified == false) {
          this.firestoreService.verifyEmail().then(() => {
            this.dialog.open(SendEmailtDialogComponent, {data: {
              userEmail: this.loginRequest.email,
              forgotPassword: false
            },
              disableClose: true
            });
          });
          this.isNewAccount = false;
        } else if (response.user.emailVerified == true) {
          
          this.session.setLogin();
          this.router.navigate(['home']);
        }
      },
      (error: any) => {
        if (error.code === "auth/email-already-in-use") {
          this.cfv.invalid(this.cfv.newEmail, ErrorTypeHelper.CREATE_USER_ERROR.emailAlreadyUsed.code);
        } else if (error.code === "auth/user-not-found") {
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
