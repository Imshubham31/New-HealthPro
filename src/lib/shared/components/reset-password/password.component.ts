import { throwError as observableThrowError, Observable } from 'rxjs';

import { finalize, catchError } from 'rxjs/operators';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseForm, SetsUpForm } from '@lib/shared/services/base-form';
import { PasswordService } from './password.service';
import { RESTSuccess } from '@lib/jnj-rest/base-rest.service';
import { PasswordUtils } from '@lib/utils/password-utils';

@Component({
    moduleId: module.id,
    selector: 'reset-password',
    templateUrl: 'password.component.html',
})
export class PasswordComponent extends BaseForm implements SetsUpForm {
    hasSubmittedOnce = false;
    @Input() state: PasswordComponentState;
    @Output() passwordUpdated = new EventEmitter<boolean>(false);

    constructor(
        private fb: FormBuilder,
        public passwordService: PasswordService,
    ) {
        super();
        this.setupForm();
    }

    setupForm() {
        this.form = this.fb.group({
            newPassword: [
                '',
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(100),
                ],
            ],
            confirmNewPassword: [
                '',
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(100),
                ],
            ],
        });
    }

    submit() {
        this.hasSubmittedOnce = true;
        if (this.passwordsDontMatch() || this.passwordTooSimple()) {
            return;
        }
        this.submitting = true;
        this.state
            .updatePassword(this)
            .pipe(
                catchError(error => {
                    this.formError = error.error.message;
                    return observableThrowError(error);
                }),
                finalize(() => (this.submitting = false)),
            )
            .subscribe(() => this.passwordUpdated.emit(true));
    }

    passwordsDontMatch() {
        return (
            this.hasSubmittedOnce &&
            this.form.value.newPassword !== this.form.value.confirmNewPassword
        );
    }

    passwordTooSimple() {
        const password = this.form.value.newPassword;
        if (!this.hasSubmittedOnce) {
            return false;
        }

        return PasswordUtils.checkComplexity(password);
    }
}

export interface PasswordComponentState {
    updatePassword(component: PasswordComponent): Observable<RESTSuccess>;
}
