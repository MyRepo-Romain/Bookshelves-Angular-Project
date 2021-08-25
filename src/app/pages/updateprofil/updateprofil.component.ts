import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
  public isDisabled: boolean = true;
  public userResponse: UserResponse;
  public userUpdateRequest: UserUpdateRequest;
  public loginRequest: LoginRequest;

  public cfv: CustomFormValid;
  public newAccount: boolean;
  public errorMessage: string;

  constructor(private session: AngularSession, public fb: FormBuilder, private firestoreService: FirestoreService, private router: Router) {
    this.userResponse = new UserResponse(undefined);
    this.userUpdateRequest = new UserUpdateRequest(undefined);
    this.loginRequest = new LoginRequest(undefined);

    this.isLoaded = new Subject();

    this.cfv = new CustomFormValid(fb, ['displayName', 'photo', 'email', 'password']);

    this.cfv.displayName.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.displayName.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);

    this.cfv.photo.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingFileSelection);

    this.cfv.email.errors.push(ErrorTypeHelper.GLOBAL_ERROR.invalidEmail);
    this.cfv.email.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.email.errors.push(ErrorTypeHelper.SIGN_IN_ERROR.invalidAuth);
    this.cfv.email.errors.push(ErrorTypeHelper.FORGET_PASSWORD_ERROR.unknownEmail);
    this.cfv.email.errors.push(ErrorTypeHelper.CREATE_USER_ERROR.emailAlreadyUsed);

    this.cfv.password.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
  }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    firebase.auth().onAuthStateChanged(response => {
      if(response) {
        this.userResponse = new UserResponse(response);
        this.userUpdateRequest = new UserUpdateRequest(this.userResponse);
        this.loginRequest = new LoginRequest(response);
        this.isLoaded.next(true);
      }
    });
  }

  fileUrlEventhandler(photo: string) {
    if(photo != undefined) {
      this.userUpdateRequest.photoURL = photo;
      this.isDisabled = false;
    }
  }

  validateUserProfil() {
    var isValid = true;

    if(this.userUpdateRequest.photoURL == undefined || this.userUpdateRequest.photoURL == '') {
      this.cfv.invalid(this.cfv.photo, ErrorTypeHelper.GLOBAL_ERROR.missingFileSelection.code);
      isValid = false;
    }

    if(this.userUpdateRequest.displayName == undefined || this.userUpdateRequest.displayName == '') {
        this.cfv.invalid(this.cfv.displayName, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
        isValid = false;
    }

    if(isValid) {
      this.updateUser();
    }

  }

  valideUserConnexion() {
    var isValid = true;

    if(this.loginRequest.email == undefined || this.loginRequest.email == '') {
      this.cfv.invalid(this.cfv.email, ErrorTypeHelper.GLOBAL_ERROR.invalidEmail.code);
      this.cfv.invalid(this.cfv.email, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
      isValid = false;
    }

    if(this.loginRequest.password == undefined || this.loginRequest.password == '') {
      this.cfv.invalid(this.cfv.password, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
      isValid = false;
    }

    if(isValid) {
      this.updateEmail();
      this.updatePassword();
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
        this.router.navigate(['profil']);
      },
      (error) => {
        this.errorMessage = "La modification a échouée";
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
