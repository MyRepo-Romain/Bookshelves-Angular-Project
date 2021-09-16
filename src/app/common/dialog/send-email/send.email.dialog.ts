import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as EmailValidator from 'email-validator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomFormValid } from 'app/core/custom.form.valid';
import { FirestoreService } from 'app/core/firestore.service';
import { ErrorTypeHelper } from 'app/helpers/error.type.helper';
import { ValidatorTypeHelper } from 'app/helpers/validator.type.helper';

export interface NewSendEmailBag {
  userEmail: string;
  forgotPassword: boolean;
}

@Component({
    selector: 'app-send-email-dialog',
    templateUrl: './send.email.dialog.html',
    styleUrls: ['./send.email.dialog.scss']
})
export class SendEmailtDialogComponent  implements OnInit{

  public userEmail: string;
  public email: string;
  public forgotPassword: boolean;
  public cfv: CustomFormValid;

  constructor(public firestoreService: FirestoreService, public fb: FormBuilder, public dialogRef: MatDialogRef<SendEmailtDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NewSendEmailBag, public dialogService: MatDialog, private snackBar: MatSnackBar) {
    if (data !== undefined) {
      this.userEmail = data.userEmail;
      this.forgotPassword = data.forgotPassword;
    }

    // initialisation du form
    this.cfv = new CustomFormValid(fb, ['email']);
    // initialisation des différentes erreurs
    this.cfv.email.errors.push(ErrorTypeHelper.GLOBAL_ERROR.invalidEmail);
    this.cfv.email.errors.push(ErrorTypeHelper.GLOBAL_ERROR.missingField);
    this.cfv.email.errors.push(ErrorTypeHelper.FORGET_PASSWORD_ERROR.unknownEmail);
  }

  ngOnInit() {
  }

  validate() {
    // on verifie que le champs n'est pas vide ou undefined
    if (this.email === '' || this.email === undefined) {
      this.cfv.invalid(this.cfv.email, ErrorTypeHelper.GLOBAL_ERROR.missingField.code);
      return false;
    }
    // on verifie que l'email correspond bien au standard d'ecriture
    if (!EmailValidator.validate(this.email)) {
      this.cfv.invalid(this.cfv.email, ErrorTypeHelper.GLOBAL_ERROR.invalidEmail.code);
      return false;
    }
    this.sendForgotPasswordEmail(this.email);
  }

  sendForgotPasswordEmail(email: string) {
    this.firestoreService.forgotPassword(email).then( () => {
      this.dialogRef.close(true);
      this.snackBar.open(ValidatorTypeHelper.SNACK_BAR_EMAIL_SEND.emailSend.msg, 'OK', {
        duration: 2000
    });
    },
    (error: any) => {
      if (error.code === "auth/user-not-found") {
        this.cfv.invalid(this.cfv.email, ErrorTypeHelper.FORGET_PASSWORD_ERROR.unknownEmail.code);
      }
    });
  }

  close() {
    this.dialogRef.close(true);
  }

}
