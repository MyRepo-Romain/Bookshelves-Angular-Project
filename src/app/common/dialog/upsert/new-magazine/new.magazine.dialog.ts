import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FirestoreService } from 'app/core/firestore.service';
import { ErrorTypeHelper } from 'app/helpers/error.type.helper';
import { CustomFormValid } from 'app/core/custom.form.valid';
import firebase from 'firebase';
import { MagazineResponse } from 'app/models/response/magazineResponce';
import { MagazineRequest } from 'app/models/request/magazineRequest';

interface NewMagazineBag {
  // recuperation de l'objet magazineResponse envoyer par l'element parent
  magazineResponse: MagazineResponse;
}

@Component({
  selector: 'app-new-magazine',
  templateUrl: './new.magazine.dialog.html',
  styleUrls: ['./new.magazine.dialog.scss']
})

export class NewMagazineDialogComponent implements OnInit {

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  // declaration des différentes variables
  public magazineRequest: MagazineRequest;
  public cfv: CustomFormValid;
  public newEntity: boolean;
  public userId: string;
  public isDisabled: boolean;
  public oldPhoto: string;

  constructor(public firestoreService: FirestoreService, public fb: FormBuilder, private router: Router, public dialogRef: MatDialogRef<NewMagazineDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: NewMagazineBag, public dialogService: MatDialog) {

    // initialisation des differentes variable

    this.isDisabled = true;

    if (data.magazineResponse !== undefined) {
      this.magazineRequest = new MagazineRequest(data.magazineResponse);
      this.oldPhoto = data.magazineResponse.photo;
      this.newEntity = false;
    } else {
      this.magazineRequest = new MagazineRequest(undefined);
      this.oldPhoto = undefined;
      this.newEntity = true;
    }

    // initialisation du form
    this.cfv = new CustomFormValid(fb,
    ['title', 'photo', 'theme', 'page', 'description']);
    // initialisation des différentes erreurs
    this.cfv.title.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.page.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.theme.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.page.errors.push(ErrorTypeHelper.GLOBAL_ERROR.invalidNumberNotZero);
    this.cfv.description.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.photo.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingFileSelection);
  }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    // recuperation de l'ID de l'utilisateur
    firebase.auth().onAuthStateChanged(response => {
      if (response) {
        this.userId = response.uid;
      }
    });
  }

  fileUrlEventhandler(photo: string) {
    // on recupere la photo est on bind sur la request - on active le bouton de de validation
    if (photo !== undefined) {
      this.magazineRequest.photo = photo;
      this.isDisabled = false;
    }
  }

  validate() {
    let isValid = true;

    // on verifie que le champs n'est pas vide ou undefined
    if (this.magazineRequest.photo === undefined || this.magazineRequest.photo === '') {
      this.cfv.invalid(this.cfv.photo, ErrorTypeHelper.GLOBAL_ERROR.missingFileSelection.code);
      isValid = false;
    }

    // on verifie que le champs n'est pas vide ou undefined
    if (this.magazineRequest.title === undefined || this.magazineRequest.title === '') {
        this.cfv.invalid(this.cfv.title, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
        isValid = false;
    }

    // on verifie que le champs n'est pas vide ou undefined
    if (this.magazineRequest.theme === undefined || this.magazineRequest.theme === '') {
      this.cfv.invalid(this.cfv.genre, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
      isValid = false;
    }

    // on verifie que le champs n'est pas vide ou undefined
    if (this.magazineRequest.description === undefined || this.magazineRequest.description === '') {
      this.cfv.invalid(this.cfv.description, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
      isValid = false;
    }

    // on verifie que le champs est bien un nombre et qu'il est supperieur à 0
    if (isNaN(this.magazineRequest.page) || this.magazineRequest.page < 0) {
      this.cfv.invalid(this.cfv.page, ErrorTypeHelper.GLOBAL_ERROR.invalidNumberNotZero.code);
      isValid = false;
    }

    if (isValid) {
      this.saveMagazine(!this.newEntity);
    }
  }

  saveMagazine(newEntity: boolean) {
    // si newEntity est à true c'est une update d'un magazine existant sinon on enregistre un nouveau magazine
    let request = newEntity ?  (this.firestoreService.deleteFile(this.oldPhoto), this.firestoreService.updateMagazine(this.magazineRequest)) : this.firestoreService.saveMagazine(this.magazineRequest, this.userId);
    request.then(
      response => {
        this.oldPhoto = undefined;
        this.dialogRef.close(true);
      },
      (error) => {
        console.log('erreur' + error);
      }
    );
  }

  close() {
    this.dialogRef.close(false);
  }
}
