import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as EmailValidator from 'email-validator';
import { Router } from '@angular/router';
import { CustomFormValid } from 'app/core/custom.form.valid';
import { FirestoreService } from 'app/core/firestore.service';
import { ErrorTypeHelper } from 'app/helpers/error.type.helper';
import { AngularSession } from 'app/angular.session';
import firebase from 'firebase';
import { Subject } from 'rxjs';
import { UserUpdateRequest } from 'app/models/request/userUpdateRequest';
import { UserResponse } from 'app/models/response/userResponse';
import { LoginRequest } from 'app/models/request/loginRequest';

@Component({
  selector: 'app-updateprofil',
  templateUrl: './updateprofil.component.html',
  styleUrls: ['./updateprofil.component.scss']
})
export class UpdateProfilComponent implements OnInit {

  public isLoaded: Subject<boolean>;

  public userResponse: UserResponse;
  public userUpdateRequest: UserUpdateRequest;
  public loginRequest: LoginRequest;

  public cfv: CustomFormValid;

  public errorMessage: string;
  public newEmail: string;
  public confirmEmail: string;
  public newUserPassword: string;
  public confirmUserPassword: string;

  public newAccount: boolean;
  public information: boolean;
  public password: boolean;
  public email: boolean;

  constructor(private session: AngularSession, public fb: FormBuilder, private firestoreService: FirestoreService, private router: Router) {
    this.isLoaded = new Subject();
    this.userResponse = new UserResponse(undefined);
    this.userUpdateRequest = new UserUpdateRequest(undefined);
    this.loginRequest = new LoginRequest(undefined);
    this.newEmail = '';
    this.confirmEmail = '';
    this.newUserPassword = '';
    this.confirmUserPassword = '';
    this.information = false;
    this.password = false;
    this.email = false;

    this.cfv = new CustomFormValid(fb, ['displayName', 'photo', 'newEmail', 'confirmEmail', 'newUserPassword', 'confirmUserPassword']);

    this.cfv.displayName.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.photo.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingFileSelection);

    this.cfv.newEmail.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.newEmail.errors.push(ErrorTypeHelper.CREATE_USER_ERROR.emailAlreadyUsed);
    this.cfv.newEmail.errors.push(ErrorTypeHelper.GLOBAL_ERROR.invalidEmail);

    this.cfv.confirmEmail.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.confirmEmail.errors.push(ErrorTypeHelper.CREATE_USER_ERROR.emailAlreadyUsed);
    this.cfv.confirmEmail.errors.push(ErrorTypeHelper.GLOBAL_ERROR.wrongConfirmEmail);

    this.cfv.newUserPassword.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.confirmUserPassword.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.confirmUserPassword.errors.push(ErrorTypeHelper.GLOBAL_ERROR.wrongConfirmUserPassword);
  }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    firebase.auth().onAuthStateChanged(response => {
      if (response) {
        this.userResponse = new UserResponse(response);
        this.userUpdateRequest = new UserUpdateRequest(this.userResponse);
        this.loginRequest = new LoginRequest(response);
        this.isLoaded.next(true);
      }
    });
  }

  fileUrlEventhandler(photo: string) {
    if (photo != undefined) {
      this.userUpdateRequest.photoURL = photo;
    }
  }

  modifyAccount(modifiyId:number) {
    switch(modifiyId) {
      case 1: this.information = !this.information; this.email = false; this.password = false;
        break;
      case 2: this.information = false; this.email = !this.email; this.password = false;
        break;
      case 3: this.information = false; this.email = false; this.password = !this.password;
        break;
      default: this.information = false; this.email = false; this.password = false;
        break;
    }
  }

  validate(validateId:number) {
    let isValid = true;

    switch(validateId) {
      case 1:
        if (this.userUpdateRequest.photoURL == undefined || this.userUpdateRequest.photoURL == '') {
          this.cfv.invalid(this.cfv.photo, ErrorTypeHelper.GLOBAL_ERROR.missingFileSelection.code);
          isValid = false;
        }
  
        if (this.userUpdateRequest.displayName == undefined || this.userUpdateRequest.displayName == '') {
          this.cfv.invalid(this.cfv.displayName, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
          isValid = false;
        }
  
        if (isValid) {
          this.updateUser();
        }
        break;
      case 2:
        if (this.newEmail == undefined || this.newEmail == '') {
          this.cfv.invalid(this.cfv.newEmail, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
          isValid = false;
        }

        if (!EmailValidator.validate(this.newEmail)) {
          this.cfv.invalid(this.cfv.newEmail, ErrorTypeHelper.GLOBAL_ERROR.invalidEmail.code);
          return false;
      }

        if (this.confirmEmail == undefined || this.confirmEmail == '') {
          this.cfv.invalid(this.cfv.confirmEmail, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
          isValid = false;
        } else if (this.confirmEmail != this.newEmail) {
          this.cfv.invalid(this.cfv.confirmEmail, ErrorTypeHelper.GLOBAL_ERROR.wrongConfirmEmail.code);
          isValid = false;
        }
        
        if (isValid) {
          this.loginRequest.email = this.confirmEmail;
          this.updateEmail();
        }
        break;
      case 3:     
        if (this.newUserPassword == undefined || this.newUserPassword == '') {
          this.cfv.invalid(this.cfv.newUserPassword, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
          isValid = false;
        }

        if (this.confirmUserPassword == undefined || this.confirmUserPassword == '') {
          this.cfv.invalid(this.cfv.confirmUserPassword, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
          isValid = false;
        } else if (this.confirmUserPassword != this.newUserPassword) {
          this.cfv.invalid(this.cfv.confirmUserPassword, ErrorTypeHelper.GLOBAL_ERROR.wrongConfirmUserPassword.code);
          isValid = false;
        }
  
        if (isValid) {
          this.loginRequest.password = this.confirmUserPassword;
          this.updatePassword();
        }
        break;
      default: isValid = false;
        break;
    }
  }

  updateUser() {
    this.firestoreService.updateUser(this.userUpdateRequest).then(
      () => {
        this.router.navigate(['profil']);
      },
      (error) => {
        this.errorMessage = "La modification a échouée";
      });
  }

  updateEmail() {
    this.firestoreService.updateEmail(this.loginRequest.email).then(
      () => {
        this.router.navigate(['updateprofil']);
        this.email = false;
      },
      (error) => {
        if (error.code === "auth/email-already-in-use") {
          this.cfv.invalid(this.cfv.email, ErrorTypeHelper.CREATE_USER_ERROR.emailAlreadyUsed.code);
        }
      });
  }

  updatePassword() {
    this.firestoreService.updatePassword(this.loginRequest.password).then(
      () => {
        this.session.clear();
        this.router.navigate(['signin']);
      },
      (error) => {
        this.errorMessage = "La modification a échouée";
      }
    );
  }

}
