import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import { AngularSession } from 'app/angular.session';
import { UserResponse } from 'app/models/response/userResponse';
import { FirestoreService } from 'app/core/firestore.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input('sidenavStatus')
  public sidenavStatus: BehaviorSubject<string>;

  @Output()
  public closeSidenavEvent: EventEmitter<any>;

  public sidenavMode: string;
  public isLoggedIn: Observable<boolean>;
  public user: UserResponse;

  constructor(public session: AngularSession, public firestoreService: FirestoreService, public router: Router) {
    this.user = new UserResponse(undefined);
    this.closeSidenavEvent = new EventEmitter();
  }

  ngOnInit() {
    this.sidenavStatus.subscribe( res => {
      this.sidenavMode = res;
    })
      this.isLoggedIn = this.session.isLoggedIn;
      this.isLoggedIn.subscribe(value => {
        if (value) {
            this.getMyself();
        }
    });
  }

  getMyself() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
      } else {
        this.user = this.firestoreService.getMySelf();
      }
    });
}

  goToHome() {
      this.router.navigate(['/home']);
  }

  closeSidenav() {
    this.closeSidenavEvent.emit(null);
  }

  signOut() {
    this.session.clear();
    this.user = undefined;
    this.router.navigate(['signin']);
  }

}
