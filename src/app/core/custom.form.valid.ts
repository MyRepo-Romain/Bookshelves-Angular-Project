import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

export class CustomFormValid {
    [index: string]: any;
    public formGroup: FormGroup;

    constructor(fb: FormBuilder, configurations: Array<string>) {
        // je reçois les differents formGroup ici et je les initialises on faisant une boucle sur chaque champ
        // que je transmet via une variable qui contient un tableau avec mes champs
        this.formGroup = fb.group({});
        configurations.forEach(key => {
            this.formGroup.addControl(key, new FormControl('', Validators.required));
            // je bind les differents champs avec leurs erreur respective
            this[key] = { ac: this.formGroup.controls[key], errors: new Array<{ code: string, msg: string }>() };
        });
    }

    public invalid(element: any, errorCode: string) {
        // si mon champs est invalide j'associe le code erreur que je veux avec la liste des codes erreurs appartenant à ce champs
        if (element !== undefined) {
            const error = element.errors.find((e: { code: string; }) => e.code === errorCode);
            const errorMessage = error === undefined ? 'invalid' : error.msg;
            element.ac.setErrors({ 'msg': errorMessage });
            element.ac.markAsTouched();
        }
    }

    public valid(element: any) {
        if (element !== undefined) {
            element.ac.setErrors(null);
            element.ac.markAsTouched();
        }
    }

}
