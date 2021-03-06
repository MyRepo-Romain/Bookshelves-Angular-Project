import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

    @Output()
    public closeSidenavEvent: EventEmitter<any>;

    constructor(public router: Router, public observer: BreakpointObserver) {
        this.closeSidenavEvent = new EventEmitter();
    }

    ngOnInit() {
    }

    closeSidenav() {
        // on utilise BreakpointObserver d'angular afin de determiner la taille de la fenetre et de changer le mode de la sidenav
        this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
            if (res.matches) {
                this.closeSidenavEvent.emit(null);
            }
        });
    }
}
