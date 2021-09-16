import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FirestoreService } from 'app/core/firestore.service';
import { ErrorTypeHelper } from 'app/helpers/error.type.helper';
import { BookRequest } from 'app/models/request/bookRequest';
import { BookResponse } from 'app/models/response/bookResponse';
import { CustomFormValid } from 'app/core/custom.form.valid';
import firebase from 'firebase';

interface NewBookBag {
  // recuperation de l'objet bookResponse envoyer par l'element parent
  bookResponse: BookResponse;
}

@Component({
  selector: 'app-new-book',
  templateUrl: './new.book.dialog.html',
  styleUrls: ['./new.book.dialog.scss']
})

export class NewBookDialogComponent implements OnInit {

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  // declaration des différentes variables
  public bookRequest: BookRequest;
  public cfv: CustomFormValid;
  public newEntity: boolean;
  public userId: string;
  public isDisabled: boolean;
  public oldPhoto: string;

  constructor(public firestoreService: FirestoreService, public fb: FormBuilder, private router: Router, public dialogRef: MatDialogRef<NewBookDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: NewBookBag, public dialogService: MatDialog) {

    // initialisation des differentes variable

    this.isDisabled = true;

    if (data.bookResponse !== undefined) {
      this.bookRequest = new BookRequest(data.bookResponse);
      this.oldPhoto = data.bookResponse.photo;
      this.newEntity = false;
    } else {
      this.bookRequest = new BookRequest(undefined);
      this.oldPhoto = undefined;
      this.newEntity = true;
    }

    // initialisation du form
    this.cfv = new CustomFormValid(fb,
    ['title', 'author', 'photo', 'genre', 'page', 'description']);
    // initialisation des différentes erreurs
    this.cfv.title.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.author.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.genre.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.page.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
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
      this.bookRequest.photo = photo;
      this.isDisabled = false;
    }
  }

  validate() {
    let isValid = true;

    // on verifie que le champs n'est pas vide ou undefined
    if (this.bookRequest.photo === undefined || this.bookRequest.photo === '') {
      this.cfv.invalid(this.cfv.photo, ErrorTypeHelper.GLOBAL_ERROR.missingFileSelection.code);
      isValid = false;
    }

    // on verifie que le champs n'est pas vide ou undefined
    if (this.bookRequest.title === undefined || this.bookRequest.title === '') {
        this.cfv.invalid(this.cfv.title, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
        isValid = false;
    }

    // on verifie que le champs n'est pas vide ou undefined
    if (this.bookRequest.author === undefined || this.bookRequest.author === '') {
        this.cfv.invalid(this.cfv.author, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
        isValid = false;
    }

    // on verifie que le champs n'est pas vide ou undefined
    if (this.bookRequest.genre === undefined || this.bookRequest.genre === '') {
      this.cfv.invalid(this.cfv.genre, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
      isValid = false;
    }

    // on verifie que le champs n'est pas vide ou undefined
    if (this.bookRequest.description === undefined || this.bookRequest.description === '') {
      this.cfv.invalid(this.cfv.description, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
      isValid = false;
    }

    // on verifie que le champs est bien un nombre et qu'il est supperieur à 0
    if (isNaN(this.bookRequest.page) || this.bookRequest.page < 0) {
      this.cfv.invalid(this.cfv.page, ErrorTypeHelper.GLOBAL_ERROR.invalidNumberNotZero.code);
      isValid = false;
    }

    if (isValid) {
      this.saveBook(!this.newEntity);
    }
  }

  saveBook(newEntity: boolean) {
    // si newEntity est à true c'est une update d'un livre existant sinon on enregistre un nouveau livre
    let request = newEntity ? (this.firestoreService.deleteFile(this.oldPhoto), this.firestoreService.updateBook(this.bookRequest)) : this.firestoreService.saveBook(this.bookRequest, this.userId);
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
