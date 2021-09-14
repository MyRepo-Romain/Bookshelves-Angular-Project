import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable } from 'rxjs/Observable';
import { AngularSession } from 'app/angular.session';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{

  @ViewChild(MatSidenav)
  public sidenav: MatSidenav;

  @Input()
  public opened: boolean;

  public sidenavStatus: BehaviorSubject<string>;
  public isLoggedIn: Observable<boolean>;

  constructor(private session: AngularSession, public observer: BreakpointObserver) {
    this.sidenavStatus = new BehaviorSubject<string>(undefined)
    this.opened = false;
  }

  ngOnInit() {
    this.isLoggedIn = this.session.isLoggedIn;
  }

  ngAfterViewInit() {
    this.isLoggedIn.subscribe( res => {
      if (res) {
        setTimeout(() => {
          this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
            if (res.matches) {
              this.sidenav.mode = "over";
              this.sidenavStatus.next(this.sidenav.mode)
              this.sidenav.close();
            } else {
              this.sidenav.mode = "side";
              this.sidenavStatus.next(this.sidenav.mode)
              this.sidenav.open();
            }
          })
        }, 0)
      }
    })
  }

  toggle() {
    this.opened = !this.opened
  }
}
