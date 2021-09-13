import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

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

    public invalid(element: any, errorCode: string) {
        if (element != undefined) {
            const error = element.errors.find((e: { code: string; }) => e.code === errorCode);
            const errorMessage = error === undefined ? 'invalid' : error.msg;
            element.ac.setErrors({ 'msg': errorMessage });
            element.ac.markAsTouched();
        }
    }

    public valid(element: any) {
        if (element != undefined) {
            element.ac.setErrors(null);
            element.ac.markAsTouched();
        }
    }

}
