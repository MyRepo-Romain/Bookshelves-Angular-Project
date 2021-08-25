import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';
import { BehaviorSubject } from 'rxjs';
import { FirestoreService } from 'app/core/firestore.service';
import { JwtHelper } from 'app/guard/jwt.helper';
@Injectable()
export class AngularSession {

    public jwtToken: string;
    public menuVisibilityValue: boolean = true;
    public loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private menuVisibility: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    public constructor(public firestoreService: FirestoreService, public auth: AngularFireAuth) {
        this.load();
    }

    get isLoggedIn() {
        return this.loggedIn.asObservable();
    }

    get isMenuVisible() {
        return this.menuVisibility.asObservable();
    }

    // #region Menu

    public toogleMenuVisibility(forceValue: boolean = undefined) {
        let value = forceValue == undefined ? !this.menuVisibilityValue : forceValue;
        this.menuVisibilityValue = value;
        this.menuVisibility.next(this.menuVisibilityValue);
    }

    // #enregion

    // #region Request, User & Languages

    public setLogin() {
        firebase.auth().currentUser.getIdToken(true).then((idToken) => {
            this.jwtToken =  'bearer ' + idToken;
            this.storage();
            this.loggedIn.next(true);
        });
    }

    public storage() {
        localStorage.setItem('bookshelves-user', JSON.stringify({ jwt: this.jwtToken}));
    }

    public load() {
        let buffer = localStorage.getItem('bookshelves-user');
        if(buffer != '' && buffer != null) {
            let obj = JSON.parse(buffer);
            this.jwtToken = obj.jwt;
            this.loggedIn.next(JwtHelper.isAuth(this.jwtToken));
        } else {
            this.jwtToken = '';
        }
        buffer = null;
    }

    public clear() {
        localStorage.setItem('bookshelves-user', '');
        this.jwtToken = '';
        this.firestoreService.signOutUser();
        this.loggedIn.next(false);
    }

    // #endregion
}
