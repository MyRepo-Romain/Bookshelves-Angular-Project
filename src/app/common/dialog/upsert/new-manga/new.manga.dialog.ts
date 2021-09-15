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
  mangaResponse: MangaResponse;
}

@Component({
  selector: 'app-new-book',
  templateUrl: './new.manga.dialog.html',
  styleUrls: ['./new.manga.dialog.scss']
})

export class NewMangaDialogComponent implements OnInit {

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  public mangaRequest: MangaRequest;
  public cfv: CustomFormValid;
  public newEntity: boolean;
  public userId: string;
  public isDisabled: boolean;
  public oldPhoto: string;

  constructor(public firestoreService: FirestoreService, public fb: FormBuilder, private router: Router, public dialogRef: MatDialogRef<NewMangaDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: NewMangaBag, public dialogService: MatDialog) {
    this.isDisabled = true;

    if (data.mangaResponse != undefined) {
      this.mangaRequest = new MangaRequest(data.mangaResponse);
      this.oldPhoto = data.mangaResponse.photo;
      console.log(this.mangaRequest)
      this.newEntity = false;
    } else {
      this.mangaRequest = new MangaRequest(undefined);
      this.oldPhoto = undefined;
      this.newEntity = true;
    }

    this.cfv = new CustomFormValid(fb,
    ['title', 'author', 'photo', 'genre', 'tome', 'description']);
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
    firebase.auth().onAuthStateChanged(response => {
      if (response) {
        this.userId = response.uid;
      }
    });
  }

  fileUrlEventhandler(photo: string) {
    if (photo != undefined) {
      this.mangaRequest.photo = photo;
      this.isDisabled = false;
    }
  }

  validate() {
    let isValid = true;

    if (this.mangaRequest.photo == undefined || this.mangaRequest.photo == '') {
      this.cfv.invalid(this.cfv.photo, ErrorTypeHelper.GLOBAL_ERROR.missingFileSelection.code);
      isValid = false;
    }

    if (this.mangaRequest.title == undefined || this.mangaRequest.title == '') {
        this.cfv.invalid(this.cfv.title, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
        isValid = false;
    }

    if (this.mangaRequest.author == undefined || this.mangaRequest.author == '') {
        this.cfv.invalid(this.cfv.author, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
        isValid = false;
    }

    if (this.mangaRequest.genre == undefined || this.mangaRequest.genre == '') {
      this.cfv.invalid(this.cfv.genre, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
      isValid = false;
    }

    if (this.mangaRequest.description == undefined || this.mangaRequest.description == '') {
      this.cfv.invalid(this.cfv.description, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
      isValid = false;
    }

    if (isNaN(this.mangaRequest.tome) || this.mangaRequest.tome < 0) {
      this.cfv.invalid(this.cfv.tome, ErrorTypeHelper.GLOBAL_ERROR.invalidNumberNotZero.code);
      isValid = false;
    }

    if (isValid) {
      this.saveManga(!this.newEntity);
    }
  }

  saveManga(update: boolean) {
    let request = update ?  (this.firestoreService.deleteFile(this.oldPhoto), this.firestoreService.updateManga(this.mangaRequest)) : this.firestoreService.saveManga(this.mangaRequest, this.userId);
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
