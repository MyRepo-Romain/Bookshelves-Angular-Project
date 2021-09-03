import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ResizedEvent } from 'angular-resize-event';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';
import { AngularSession } from 'app/angular.session';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{

  @ViewChild('sidenav')
  public menu: MatSidenav;
  public isLoggedIn: Observable<boolean>;

  constructor(private session: AngularSession) { }

  onResized(event: ResizedEvent) {
    if (this.menu != undefined) {
        if (event.newWidth < environment.smartphoneWidth) {
            this.menu.mode = 'over';
        } else {
            this.menu.mode = 'side';
        }
        this.session.toogleMenuVisibility(true);
    }
}

  ngOnInit() {
    this.isLoggedIn = this.session.isLoggedIn;
    this.session.isMenuVisible.subscribe(() => {
      if (this.menu != undefined) {
          this.menu.opened = this.session.menuVisibilityValue;
          this.menu.openedChange.subscribe((value) => {
              this.session.menuVisibilityValue = value;
          });
      }
  });

  }

}
