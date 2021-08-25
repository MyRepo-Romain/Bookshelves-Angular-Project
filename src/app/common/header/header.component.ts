import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import { AngularSession } from 'app/angular.session';
import { UserResponse } from 'app/models/response/userResponse';
import { FirestoreService } from 'app/core/firestore.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public isLoggedIn: Observable<boolean>;
  public user: UserResponse;

  constructor(public session: AngularSession, public firestoreService: FirestoreService, public router: Router) {
    this.user = new UserResponse(undefined);
  }

  ngOnInit() {
      this.isLoggedIn = this.session.isLoggedIn;
      this.isLoggedIn.subscribe(value => {
        if(value) {
            this.getMyself();
        }
    });
  }

  getMyself() {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.user = user;
      } else {
        this.user = this.firestoreService.getMySelf();
      }
    });
}

  goToHome() {
      this.router.navigate(['/home']);
  }

  toogleMenu() {
    this.session.toogleMenuVisibility();
}

  signOut() {
    this.session.clear();
    this.user = undefined;
    this.router.navigate(['signin']);
  }

}
