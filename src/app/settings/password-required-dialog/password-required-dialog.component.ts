import { EventEmitter } from '@angular/core';
import { Component, ViewChild, Input, Output } from '@angular/core';
import { ModalControls } from '@lib/shared/components/modal/modal.service';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { BaseForm } from '@lib/shared/services/base-form';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { LocaliseService } from '@lib/localise/localise.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'password-required-dialog',
    templateUrl: './password-required-dialog.component.html',
    styleUrls: ['./password-required-dialog.component.scss'],
})
export class PasswordRequiredDialogComponent extends BaseForm
    implements ModalControls {
    @Input() title: string;
    @Input() subtitle: string;
    @Input() successMessage: string;
    @Output() onSuccess = new EventEmitter();
    @ViewChild('modal', { static: true }) modal: ModalWrapperComponent;

    constructor(
        private fb: FormBuilder,
        private authentication: AuthenticationService,
        private localiseService: LocaliseService,
    ) {
        super();
        this.setupForm();
    }

    open() {
        this.modal.openModal();
    }

    close() {
        this.cleanForm();
        this.modal.closeModal();
    }

    setupForm() {
        this.formError = null;
        this.form = this.fb.group({
            password: ['', [Validators.required]],
        });
    }

    submit() {
        this.submitting = true;
        this.authentication
            .verifyPassword(this.form.get('password').value)
            .subscribe(
                () => {
                    this.close();
                    this.submitting = false;
                    this.onSuccess.next();
                },
                (error: HttpErrorResponse) => {
                    this.submitting = false;
                    if (error.status === 401) {
                        this.formError = this.localiseService.fromKey(
                            'badPassword',
                        );
                        this.form.reset();
                    } else if (error.status === 403) {
                        AuthenticationService.logout(
                            'accountBlockedFifteenMinutes',
                        );
                    } else {
                        this.formError = this.localiseService.fromKey(
                            'unknownError',
                        );
                    }
                },
            );
    }
}
