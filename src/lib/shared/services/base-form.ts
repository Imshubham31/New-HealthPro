import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable()
export class BaseForm {
    form: FormGroup;
    submitting = false;
    formError: any;

    submit() {
        if (!this.form.valid) {
            return;
        }
    }

    shouldDisableSubmit() {
        return !this.form.valid || this.form.pristine || this.submitting;
    }

    cleanForm() {
        this.form.reset();
        this.submitting = false;
    }
}

export interface SetsUpForm {
    setupForm();
}
