import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';

export class CustomFormValid {
    [index: string]: any;
    public formGroup: FormGroup;

    constructor(fb: FormBuilder, configurations: Array<string>) {
        this.formGroup = fb.group({});
        configurations.forEach(key => {
            this.formGroup.addControl(key, new FormControl('', Validators.required));
            this[key] = { ac: this.formGroup.controls[key], errors: new Array<{ code: string, msg: string }>() };
        });
    }

    public addConfiguration(configuration: string) {
        this.formGroup.addControl(configuration, new FormControl('', Validators.required));
        this[configuration] = { ac: this.formGroup.controls[configuration], errors: new Array<{ code: string, msg: string }>() };
    }

    private getAllAbstractControl(): Array<any> {
        return Object.keys(this).filter(key => this[key].ac instanceof AbstractControl).map(key => this[key]);
    }

    public invalid(element: any, errorCode: string) {
        if(element != undefined) {
            const error = element.errors.find((e: { code: string; }) => e.code === errorCode);
            const errorMessage = error === undefined ? 'invalid' : error.msg;
            element.ac.setErrors({ 'msg': errorMessage });
            element.ac.markAsTouched();
        }
    }

    public invalidAll(errorCode: string) {
        const stack = this.getAllAbstractControl();
        stack.forEach(element => {
            const error = element.errors.find((e: { code: string; }) => e.code === errorCode);
            const errorMessage = error === undefined ? 'invalid' : error.msg;
            element.ac.setErrors({ 'msg': errorMessage });
            element.ac.markAsTouched();
        });
    }

    public validAll() {
        const stack = this.getAllAbstractControl();
        stack.forEach(element => {
            element.ac.setErrors(null);
            element.ac.markAsTouched();
        });
    }

    public valid(element: any) {
        if(element != undefined) {
            element.ac.setErrors(null);
            element.ac.markAsTouched();
        }
    }

    public reset(element: any) {
        if(element != undefined) {
            element.ac.reset();
        }
    }

    public resetAll() {
        const stack = this.getAllAbstractControl();
        stack.forEach(element => {
            element.ac.reset();
        });
    }
}
