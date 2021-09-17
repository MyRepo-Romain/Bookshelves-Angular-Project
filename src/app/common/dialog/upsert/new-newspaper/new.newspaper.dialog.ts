import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FirestoreService } from 'app/core/firestore.service';
import { ErrorTypeHelper } from 'app/helpers/error.type.helper';
import { CustomFormValid } from 'app/core/custom.form.valid';
import firebase from 'firebase';
import { NewspaperResponse } from 'app/models/response/newspaperResponce';
import { NewspaperRequest } from 'app/models/request/newspaperRequest';
import { DateHelper } from 'app/helpers/date.helper';

interface NewNewspaperBag {
  // recuperation de l'objet bookResponse envoyer par l'element parent
  newspaperResponse: NewspaperResponse;
}

@Component({
  selector: 'app-new-newspaper',
  templateUrl: './new.newspaper.dialog.html',
  styleUrls: ['./new.newspaper.dialog.scss']
})

export class NewNewspaperDialogComponent implements OnInit {

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  // declaration des différentes variables
  public newspaperRequest: NewspaperRequest;
  public cfv: CustomFormValid;
  public newEntity: boolean;
  public userId: string;
  public isDisabled: boolean;
  public oldPhoto: string;

  constructor(public firestoreService: FirestoreService, public fb: FormBuilder, private router: Router, public dialogRef: MatDialogRef<NewNewspaperDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: NewNewspaperBag, public dialogService: MatDialog) {

    // initialisation des differentes variable
    this.isDisabled = true;
    this.oldPhoto = undefined;

    if (data.newspaperResponse !== undefined) {
      this.newspaperRequest = new NewspaperRequest(data.newspaperResponse);
      this.newEntity = false;
    } else {
      this.newspaperRequest = new NewspaperRequest(undefined);
      this.newEntity = true;
    }

    // initialisation du form
    this.cfv = new CustomFormValid(fb,
    ['title', 'photo', 'description', 'datePK']);
    // initialisation des différentes erreurs
    this.cfv.title.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.description.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.photo.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingFileSelection);
    this.cfv.datePK.errors.push(ErrorTypeHelper.GLOBAL_ERROR.invalidDate);
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
      this.oldPhoto = this.data.newspaperResponse.photo;
      this.newspaperRequest.photo = photo;
      this.isDisabled = false;
    }
  }

  public dateSelectedEventHandler(dateSelected: Date) {
    if (dateSelected !== undefined) {
        this.newspaperRequest.date = DateHelper.toLocal(dateSelected);
    }
  }

  validate() {
    let isValid = true;

    // on verifie que le champs n'est pas vide ou undefined
    if (this.newspaperRequest.photo === undefined || this.newspaperRequest.photo === '') {
      this.cfv.invalid(this.cfv.photo, ErrorTypeHelper.GLOBAL_ERROR.missingFileSelection.code);
      isValid = false;
    }

    // on verifie que le champs n'est pas vide ou undefined
    if (this.newspaperRequest.title === undefined || this.newspaperRequest.title === '') {
        this.cfv.invalid(this.cfv.title, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
        isValid = false;
    }

    // on verifie que le champs n'est pas vide ou undefined
    if (this.newspaperRequest.description === undefined || this.newspaperRequest.description === '') {
      this.cfv.invalid(this.cfv.description, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
      isValid = false;
    }

    // on verifie que le champs n'est pas vide ou undefined
    if (this.newspaperRequest.date === undefined) {
      this.cfv.invalid(this.cfv.datePK, ErrorTypeHelper.GLOBAL_ERROR.invalidDate.code);
      isValid = false;
    }

    if (isValid) {
      this.saveNewspaper(!this.newEntity);
    }
  }

  saveNewspaper(newEntity: boolean) {
    // si newEntity est à true c'est une update d'un journal existant sinon on enregistre un nouveau journal
    let request = newEntity ?  (this.firestoreService.deleteFile(this.oldPhoto), this.firestoreService.updateNewspaper(this.newspaperRequest)) : this.firestoreService.saveNewspaper(this.newspaperRequest, this.userId);
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
