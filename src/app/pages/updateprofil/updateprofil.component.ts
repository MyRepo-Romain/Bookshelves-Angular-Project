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
import { environment } from 'environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-updateprofil',
  templateUrl: './updateprofil.component.html',
  styleUrls: ['./updateprofil.component.scss']
})
export class UpdateProfilComponent implements OnInit {

  // création des différentes variables necessaires
  public isLoaded: Subject<boolean>;

  public userResponse: UserResponse;
  public userUpdateRequest: UserUpdateRequest;
  public loginRequest: LoginRequest;

  public cfv: CustomFormValid;

  public newEmail: string;
  public confirmEmail: string;
  public newPassword: string;
  public confirmPassword: string;
  public oldPhoto: string;

  public newAccount: boolean;
  public information: boolean;
  public password: boolean;
  public email: boolean;

  constructor(private session: AngularSession, public fb: FormBuilder, private firestoreService: FirestoreService, private router: Router, public snackBar: MatSnackBar) {
    // initialisation des variables
    this.isLoaded = new Subject();
    this.userResponse = new UserResponse(undefined);
    this.userUpdateRequest = new UserUpdateRequest(undefined);
    this.loginRequest = new LoginRequest(undefined);
    this.newEmail = '';
    this.confirmEmail = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.information = false;
    this.password = false;
    this.email = false;

    // création des forms
    this.cfv = new CustomFormValid(fb, ['displayName', 'photo', 'newEmail', 'confirmEmail', 'newPassword', 'confirmPassword']);

    // initialisation des erreurs
    this.cfv.displayName.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.photo.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingFileSelection);

    this.cfv.newEmail.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.newEmail.errors.push(ErrorTypeHelper.CREATE_USER_ERROR.emailAlreadyUsed);
    this.cfv.newEmail.errors.push(ErrorTypeHelper.GLOBAL_ERROR.invalidEmail);

    this.cfv.confirmEmail.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.confirmEmail.errors.push(ErrorTypeHelper.CREATE_USER_ERROR.emailAlreadyUsed);
    this.cfv.confirmEmail.errors.push(ErrorTypeHelper.GLOBAL_ERROR.wrongConfirmEmail);

    this.cfv.newPassword.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.newPassword.errors.push(ErrorTypeHelper.GLOBAL_ERROR.toWeakPassword);

    this.cfv.confirmPassword.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.confirmPassword.errors.push(ErrorTypeHelper.GLOBAL_ERROR.wrongConfirmPassword);
    this.cfv.confirmPassword.errors.push(ErrorTypeHelper.GLOBAL_ERROR.toWeakPassword);

  }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    firebase.auth().onAuthStateChanged(response => {
      if (response) {
        // on recupere les info de l'utilisateur et on remplie les différentes variables avec les données
        this.userResponse = new UserResponse(response);
        this.userUpdateRequest = new UserUpdateRequest(this.userResponse);
        this.loginRequest = new LoginRequest(response);
        this.oldPhoto = response.photoURL;
        this.isLoaded.next(true);
      }
    });
  }

  fileUrlEventhandler(photo: string) {
    if (photo !== undefined) {
      this.userUpdateRequest.photoURL = photo;
    }
  }

  modifyAccount(modifiyId: number) {
    // switch case qui permet la navigation dans le menu des option du compte
    switch (modifiyId) {
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

  validate(validateId: number) {
    // switch case qui permet de valider chaque champs en fonction du menu selectionné
    let isValid = true;

    switch (validateId) {
      case 1:
        // on verifie que le champs n'est pas vide ou undefined
        if (this.userUpdateRequest.photoURL === undefined || this.userUpdateRequest.photoURL === '') {
          this.cfv.invalid(this.cfv.photo, ErrorTypeHelper.GLOBAL_ERROR.missingFileSelection.code);
          isValid = false;
        }

        // on verifie que le champs n'est pas vide ou undefined
        if (this.userUpdateRequest.displayName === undefined || this.userUpdateRequest.displayName === '') {
          this.cfv.invalid(this.cfv.displayName, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
          isValid = false;
        }

        if (isValid) {
          this.updateUser();
        }
      break;
      case 2:
        // on verifie que le champs n'est pas vide ou undefined
        if (this.newEmail === undefined || this.newEmail === '') {
          this.cfv.invalid(this.cfv.newEmail, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
          isValid = false;
        }

        // on verifie que l'email correspond bien au standard d'ecriture
        if (!EmailValidator.validate(this.newEmail)) {
          this.cfv.invalid(this.cfv.newEmail, ErrorTypeHelper.GLOBAL_ERROR.invalidEmail.code);
          isValid = false;
        }

        // on verifie que le champs n'est pas vide ou undefined
        if (this.confirmEmail === undefined || this.confirmEmail === '') {
          this.cfv.invalid(this.cfv.confirmEmail, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
          isValid = false;
        }

        // on verifie que les deux champs sont identiques
        if (this.confirmEmail !== this.newEmail) {
          this.cfv.invalid(this.cfv.confirmEmail, ErrorTypeHelper.GLOBAL_ERROR.wrongConfirmEmail.code);
          isValid = false;
        }

        if (isValid) {
          // si tout est valide j'associe le mail à la request
          this.loginRequest.email = this.confirmEmail;
          this.updateEmail();
        }
      break;
      case 3:
        // on verifie que le champs n'est pas vide ou undefined
        if (this.newPassword === undefined || this.newPassword === '') {
          this.cfv.invalid(this.cfv.newPassword, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
          isValid = false;
        }

        // on verifie que le mot de passe correspond bien à la regex etablie dans les variables d'environnements
        if (!environment.passwordRegex.test(this.newPassword)) {
          this.cfv.invalid(this.cfv.newPassword, ErrorTypeHelper.GLOBAL_ERROR.toWeakPassword.code);
          isValid = false;
        }

        // on verifie que le champs n'est pas vide ou undefined
        if (this.confirmPassword === undefined || this.confirmPassword === '') {
          this.cfv.invalid(this.cfv.confirmPassword, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
          isValid = false;
        }

        // on verifie que les deux champs sont identiques
        if (this.confirmPassword !== this.newPassword) {
          this.cfv.invalid(this.cfv.confirmPassword, ErrorTypeHelper.GLOBAL_ERROR.wrongConfirmPassword.code);
          isValid = false;
        }

        // on verifie que le mot de passe correspond bien à la regex etablie dans les variables d'environnements
        if (!environment.passwordRegex.test(this.confirmPassword)) {
          this.cfv.invalid(this.cfv.confirmPassword, ErrorTypeHelper.GLOBAL_ERROR.toWeakPassword.code);
          isValid = false;
        }

        if (isValid) {
          // si tout est valide j'associe le mot de passe à la request
          this.loginRequest.password = this.confirmPassword;
          this.updatePassword();
        }
      break;
      default: isValid = false;
      break;
    }
  }

  updateUser() {
    // suppression de l'ancienne photo
    if (this.oldPhoto !== undefined && this.oldPhoto !== "") {
      this.firestoreService.deleteFile(this.oldPhoto);
    }
    // update du profil
    this.firestoreService.updateUser(this.userUpdateRequest).then(
      () => {
        this.oldPhoto = undefined;
        this.router.navigate(['profil']);
      },
      (error) => {
        this.snackBar.open(ErrorTypeHelper.SNACK_BAR_INFORMATION.updateUserFail.msg, 'OK');
      });

  }

  updateEmail() {
    // update du mail
    this.firestoreService.updateEmail(this.loginRequest.email).then(
      () => {
        this.router.navigate(['updateprofil']);
        this.email = false;
      },
      (error) => {
        if (error.code === "auth/email-already-in-use") {
          this.cfv.invalid(this.cfv.newEmail, ErrorTypeHelper.CREATE_USER_ERROR.emailAlreadyUsed.code);
          this.cfv.invalid(this.cfv.confirmEmail, ErrorTypeHelper.CREATE_USER_ERROR.emailAlreadyUsed.code);
        } else {
          this.snackBar.open(ErrorTypeHelper.SNACK_BAR_INFORMATION.updateMailFail.msg, 'OK');
        }
      });
  }

  updatePassword() {
    // update du mot de passe
    this.firestoreService.updatePassword(this.loginRequest.password).then(
      () => {
        this.session.clear();
        this.router.navigate(['signin']);
      },
      (error) => {
        this.snackBar.open(ErrorTypeHelper.SNACK_BAR_INFORMATION.updatePasswordFail.msg, 'OK');
      }
    );
  }

}
