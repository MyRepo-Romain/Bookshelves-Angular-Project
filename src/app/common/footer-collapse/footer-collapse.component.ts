import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface ActionConfirmed {
    edit: boolean;
    remove: boolean;
    entity: any;
}

@Component({
    selector: 'footer-collapse',
    templateUrl: './footer-collapse.component.html',
    styleUrls: ['./footer-collapse.component.scss']
})
export class FooterCollapseComponent {

    @Output()
    action: EventEmitter<ActionConfirmed>;

    @Input('editLabel')
    public editLabel: string;

    @Input('deleteLabel')
    public deleteLabel: string;

    @Input('entity')
    public entity: any;

    constructor() {
        this.entity = undefined;
        this.action = new EventEmitter();
        this.deleteLabel = 'Supprimer';
        this.editLabel = 'Éditer';
    }

    delete() {
        if (this.entity != undefined) {
            this.action.emit({ remove: true, edit: false, entity: this.entity });
        }
    }

    edit() {
        if (this.entity != undefined) {
            this.action.emit({ remove: false, edit: true, entity: this.entity });
        }
    }
}
