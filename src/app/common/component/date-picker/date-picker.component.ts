import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CustomFormValid } from 'app/core/custom.form.valid';

@Component({
    selector: 'date-picker',
    templateUrl: './date-picker.component.html',
    styleUrls: ['./date-picker.component.scss'],
    providers: []
})

export class DateSelectComponent implements OnInit {

    @Input('showFloatLabel')
    public showFloatLabel: boolean = true;

    @Input('cfv')
    public cfv: CustomFormValid;

    @Input('full-width')
    public fullWidth: boolean;

    @Input('dateSelected')
    public dateSelected: Date;

    @Input('disabled')
    public disabled: boolean;

    @Output()
    dateSelectedEvent: EventEmitter<Date>;

    public dateCtrl: FormControl;

    constructor() {
        this.dateSelectedEvent = new EventEmitter();
        this.dateCtrl = new FormControl();
    }

    ngOnInit() {
        this.cfv.datePK.ac = this.dateCtrl;
        this.initDateSelect();
    }

    redirectClick() {
        let root = document.getElementById('dpk');
        if(root != undefined) {
            var button = root.firstElementChild as HTMLElement;
            if(button != undefined) {
                button.click();
            }
        }
    }

    initDateSelect() {
        this.dateCtrl.setValue(this.dateSelected != undefined ? this.dateSelected : undefined);
    }

    dateChange(dateSelectedNow: MatDatepickerInputEvent<Date>) {
        this.dateSelected = dateSelectedNow.value;
        this.dateSelectedEvent.emit(this.dateSelected);
    }
}
