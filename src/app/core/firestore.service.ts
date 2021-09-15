import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { throwError } from 'rxjs';
import { BookRequest } from 'app/models/request/bookRequest';
import { LoginRequest } from 'app/models/request/loginRequest';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserUpdateRequest } from 'app/models/request/userUpdateRequest';
import { MagazineRequest } from 'app/models/request/magazineRequest';
import { NewspaperRequest } from 'app/models/request/newspaperRequest';
import { MangaRequest } from 'app/models/request/mangaRequest';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public firestore: AngularFirestore, public afAuth: AngularFireAuth) {
  }

  private handleError(err: HttpErrorResponse | any) {
    if (err.status === 401) {
      // Nothing for the moment
    }
    return throwError(err);
  }

  // region authentification //

  createNewUser(loginRequest: LoginRequest) {
    return firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(() => {
      return firebase.auth().createUserWithEmailAndPassword(loginRequest.email, loginRequest.password);
    })
  }

  signInUser(loginRequest: LoginRequest) {
    return firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(() => {
      return firebase.auth().signInWithEmailAndPassword(loginRequest.email, loginRequest.password);
    })
  }

  signOutUser() {
    firebase.auth().signOut();
  }

  verifyEmail() {
    return firebase.auth().currentUser.sendEmailVerification();
  }

  forgotPassword(email: string) {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  // endregion //

  //#region user

    getMySelf() {
      return firebase.auth().currentUser;
    }

    updateUser(userUpdateRequest: UserUpdateRequest) {
      return firebase.auth().currentUser.updateProfile({
        displayName: userUpdateRequest.displayName,
        photoURL: userUpdateRequest.photoURL
      });
    }

    updateEmail(email: string) {
      return firebase.auth().currentUser.updateEmail(email);
    }

    updatePassword(password: string) {
      return firebase.auth().currentUser.updatePassword(password);
    }


    deleteUserAccount(userPhoto: string) {
      if (userPhoto != undefined || userPhoto != null) {
        firebase.storage().refFromURL(userPhoto).delete();
      }
      return firebase.auth().currentUser.delete();
    }

    deleteUserBook(userId: string) {
      firebase.firestore().collection("book").where('userId', '==', userId).get()
      .then( (querySnapshot) => {
        querySnapshot.forEach( (doc) => {
          doc.ref.delete();
        });
      });
    }

    deleteUserManga(userId: string) {
      firebase.firestore().collection("manga").where('userId', '==', userId).get()
      .then( (querySnapshot) => {
        querySnapshot.forEach( (doc) => {
          doc.ref.delete();
        });
      });
    }

    deleteUserMagazine(userId: string) {
      firebase.firestore().collection("magazine").where('userId', '==', userId).get()
      .then( (querySnapshot) => {
        querySnapshot.forEach( (doc) => {
          doc.ref.delete();
        });
      });
    }

    deleteUserNewpaper(userId: string) {
      firebase.firestore().collection("newspaper").where('userId', '==', userId).get()
      .then( (querySnapshot) => {
        querySnapshot.forEach( (doc) => {
          doc.ref.delete();
        });
      });
    }

  // endregion //

  // region book //

    saveBook(bookRequest: BookRequest, userId: string) {
      return this.firestore.collection("book").add({
        title: bookRequest.title,
        author: bookRequest.author,
        photo: bookRequest.photo,
        page: bookRequest.page,
        description: bookRequest.description,
        genre: bookRequest.genre,
        userId: userId
      }).then(
        () => {
          console.log("Document successfully donwloaded!");
        }).catch(this.handleError);
    }

    getAllBooks() {
      return this.firestore.collection("book").get();
    }

    updateBook(bookRequest: BookRequest) {
      return this.firestore.collection("book").doc(bookRequest.id).update({
        title: bookRequest.title,
        author: bookRequest.author,
        photo: bookRequest.photo,
        page: bookRequest.page,
        description: bookRequest.description,
        genre: bookRequest.genre
      }).then(
        () => {
          console.log("Document successfully updated!");
        }).catch(this.handleError);
    }

    deleteBook(entity: BookRequest) {
      return this.firestore.collection("book").doc(entity.id).delete()
      .then(
        () => {
          console.log("Document successfully deleted!");
        }).catch(this.handleError);
    }

  // endregion //

  // region magazines //

    saveMagazine(magazineRequest: MagazineRequest, userId: string) {
      return this.firestore.collection("magazine").add({
        title: magazineRequest.title,
        photo: magazineRequest.photo,
        page: magazineRequest.page,
        description: magazineRequest.description,
        theme: magazineRequest.theme,
        userId: userId
      }).then(
        () => {
          console.log("Document successfully donwloaded!");
        }).catch(this.handleError);
    }

    getAllMagazines() {
      return this.firestore.collection("magazine").get();
    }

    updateMagazine(magazineRequest: MagazineRequest) {
      return this.firestore.collection("magazine").doc(magazineRequest.id).update({
        title: magazineRequest.title,
        photo: magazineRequest.photo,
        page: magazineRequest.page,
        description: magazineRequest.description,
        theme: magazineRequest.theme
      }).then(
        () => {
          console.log("Document successfully updated!");
        }).catch(this.handleError);
    }

    deleteMagazine(entity: MagazineRequest) {
      return this.firestore.collection("magazine").doc(entity.id).delete()
      .then(
        () => {
          console.log("Document successfully deleted!");
        }).catch(this.handleError);
    }

  // endregion //

  // region newspaper //

    saveNewspaper(newspaperRequest: NewspaperRequest, userId: string) {
      return this.firestore.collection("newspaper").add({
        title: newspaperRequest.title,
        photo: newspaperRequest.photo,
        description: newspaperRequest.description,
        date: newspaperRequest.date,
        userId: userId
      }).then(
        () => {
          console.log("Document successfully donwloaded!");
      }).catch(this.handleError);
    }

    getAllNewspapers() {
      return this.firestore.collection("newspaper").get();
    }

    updateNewspaper(newspaperRequest: NewspaperRequest) {
      return this.firestore.collection("newspaper").doc(newspaperRequest.id).update({
        title: newspaperRequest.title,
        photo: newspaperRequest.photo,
        description: newspaperRequest.description,
        date: newspaperRequest.date
      }).then(
        () => {
          console.log("Document successfully updated!");
        }).catch(this.handleError);
    }

    deleteNewspaper(entity: NewspaperRequest) {
      return this.firestore.collection("newspaper").doc(entity.id).delete()
      .then(
        () => {
          console.log("Document successfully deleted!");
        }).catch(this.handleError);
    }

  // endregion //

  // region manga //

    saveManga(mangaRequest: MangaRequest, userId: string) {
      return this.firestore.collection("manga").add({
        title: mangaRequest.title,
        author: mangaRequest.author,
        photo: mangaRequest.photo,
        tome: mangaRequest.tome,
        description: mangaRequest.description,
        genre: mangaRequest.genre,
        userId: userId
      }).then(
        () => {
          console.log("Document successfully donwloaded!");
      }).catch(this.handleError);
    }

    getAllMangas() {
      return this.firestore.collection("manga").get();
    }

    updateManga(mangaRequest: MangaRequest) {
      return this.firestore.collection("manga").doc(mangaRequest.id).update({
        title: mangaRequest.title,
        photo: mangaRequest.photo,
        page: mangaRequest.tome,
        description: mangaRequest.description,
        theme: mangaRequest.genre,
      }).then(
        () => {
          console.log("Document successfully updated!");
        }).catch(this.handleError);
    }

    deleteManga(entity: MangaRequest) {
      return this.firestore.collection("manga").doc(entity.id).delete()
      .then(
        () => {
          console.log("Document successfully deleted!");
        }).catch(this.handleError);
    }

  // endregion //

  // region image //

    uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const downloadFileDate = Date.now().toString();
        const uploadFile = firebase.storage().ref().child('image/' + downloadFileDate + file.name).put(file);
        uploadFile.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('chargement ...');
          },
          (error: any) => {
            console.log('erreur de chargement' + error);
            reject();
          },
          () => {
            console.log('Photo téléchargée avec succes!');
            resolve(uploadFile.snapshot.ref.getDownloadURL());
          }
        );
      }
    );
  }

  deleteFile(entity: any) {
    return firebase.storage().refFromURL(entity).delete()
    .then(
      () => {
        console.log("photo successfully deleted!");
      }).catch(this.handleError);
  }

  // endregion //

}
