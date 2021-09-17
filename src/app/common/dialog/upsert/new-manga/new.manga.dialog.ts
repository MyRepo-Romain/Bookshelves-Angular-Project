import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FirestoreService } from 'app/core/firestore.service';
import { ErrorTypeHelper } from 'app/helpers/error.type.helper';
import { CustomFormValid } from 'app/core/custom.form.valid';
import firebase from 'firebase';
import { MangaResponse } from 'app/models/response/mangaResponse';
import { MangaRequest } from 'app/models/request/mangaRequest';

interface NewMangaBag {
  // recuperation de l'objet mangaResponse envoyer par l'element parent
  mangaResponse: MangaResponse;
}

@Component({
  selector: 'app-new-book',
  templateUrl: './new.manga.dialog.html',
  styleUrls: ['./new.manga.dialog.scss']
})

export class NewMangaDialogComponent implements OnInit {

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  // declaration des différentes variables
  public mangaRequest: MangaRequest;
  public cfv: CustomFormValid;
  public newEntity: boolean;
  public userId: string;
  public isDisabled: boolean;
  public oldPhoto: string;

  constructor(public firestoreService: FirestoreService, public fb: FormBuilder, private router: Router, public dialogRef: MatDialogRef<NewMangaDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: NewMangaBag, public dialogService: MatDialog) {

    // initialisation des differentes variable

    this.isDisabled = true;
    this.oldPhoto = undefined;

    if (data.mangaResponse !== undefined) {
      this.mangaRequest = new MangaRequest(data.mangaResponse);
      this.newEntity = false;
    } else {
      this.mangaRequest = new MangaRequest(undefined);
      this.newEntity = true;
    }

    // initialisation du form
    this.cfv = new CustomFormValid(fb,
    ['title', 'author', 'photo', 'genre', 'tome', 'description']);

    // initialisation des différentes erreurs
    this.cfv.title.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.author.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.genre.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.tome.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.tome.errors.push(ErrorTypeHelper.GLOBAL_ERROR.invalidNumberNotZero);
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
      this.oldPhoto = this.data.mangaResponse.photo;
      this.mangaRequest.photo = photo;
      this.isDisabled = false;
    }
  }

  validate() {
    let isValid = true;

    // on verifie que le champs n'est pas vide ou undefined
    if (this.mangaRequest.photo === undefined || this.mangaRequest.photo === '') {
      this.cfv.invalid(this.cfv.photo, ErrorTypeHelper.GLOBAL_ERROR.missingFileSelection.code);
      isValid = false;
    }

    // on verifie que le champs n'est pas vide ou undefined
    if (this.mangaRequest.title === undefined || this.mangaRequest.title === '') {
        this.cfv.invalid(this.cfv.title, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
        isValid = false;
    }

    // on verifie que le champs n'est pas vide ou undefined
    if (this.mangaRequest.author === undefined || this.mangaRequest.author === '') {
        this.cfv.invalid(this.cfv.author, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
        isValid = false;
    }

    // on verifie que le champs n'est pas vide ou undefined
    if (this.mangaRequest.genre === undefined || this.mangaRequest.genre === '') {
      this.cfv.invalid(this.cfv.genre, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
      isValid = false;
    }

    // on verifie que le champs n'est pas vide ou undefined
    if (this.mangaRequest.description === undefined || this.mangaRequest.description === '') {
      this.cfv.invalid(this.cfv.description, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
      isValid = false;
    }

    // on verifie que le champs est bien un nombre et qu'il est supperieur à 0
    if (isNaN(this.mangaRequest.tome) || this.mangaRequest.tome < 0) {
      this.cfv.invalid(this.cfv.tome, ErrorTypeHelper.GLOBAL_ERROR.invalidNumberNotZero.code);
      isValid = false;
    }

    if (isValid) {
      this.saveManga(!this.newEntity);
    }
  }

  saveManga(newEntity: boolean) {
    // si newEntity est à true c'est une update d'un manga existant sinon on enregistre un nouveau manga
    let request = newEntity ?  (this.firestoreService.deleteFile(this.oldPhoto), this.firestoreService.updateManga(this.mangaRequest)) : this.firestoreService.saveManga(this.mangaRequest, this.userId);
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
