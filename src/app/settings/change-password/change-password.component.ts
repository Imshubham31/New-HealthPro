import { Component, ViewChild } from '@angular/core';
import { ModalControls } from '../../../lib/shared/components/modal/modal.service';
import { BaseForm } from '../../../lib/shared/services/base-form';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { FormBuilder, Validators } from '@angular/forms';
import { PasswordUtils } from '@lib/utils/password-utils';
import { PasswordService } from '@lib/shared/components/reset-password/password.service';
import { ToastService } from '../../../lib/shared/components/toast/toast.service';
import { finalize } from 'rxjs/operators';
import { LocaliseService } from '@lib/localise/localise.service';
import { ToastStyles } from '@lib/shared/components/toast/toast.service';
import { RestError } from '@lib/shared/services/error.pipe';
import { AuthenticationService } from '@lib/authentication/authentication.service';

@Component({
    selector: 'change-password',
    templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent extends BaseForm implements ModalControls {
    @ViewChild(ModalWrapperComponent, { static: true })
    modal: ModalWrapperComponent;
    hasSubmittedOnce = false;
    error: RestError;

    constructor(
        private fb: FormBuilder,
        private passwordService: PasswordService,
        private toastService: ToastService,
        private localiseService: LocaliseService,
    ) {
        super();
    }
    open() {
        this.setupForm();
        this.modal.openModal();
    }
    close() {
        this.hasSubmittedOnce = false;
        super.cleanForm();
        this.modal.closeModal();
    }

    setupForm() {
        this.form = this.fb.group({
            oldPassword: [
                '',
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(100),
                ],
            ],
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
        this.error = null;
        this.passwordService
            .changePassword({
                oldPassword: this.form.value.oldPassword,
                newPassword: this.form.value.newPassword,
            })
            .pipe(finalize(() => (this.submitting = false)))
            .subscribe(
                success => {
                    this.toastService.show(
                        null,
                        this.localiseService.fromKey('passwordUpdated'),
                        ToastStyles.Success,
                    );
                    this.modal.closeModal();
                },
                err => {
                    this.error = err.error;
                    if (err.status === 403) {
                        AuthenticationService.logout(
                            'accountBlockedFifteenMinutes',
                        );
                    }
                },
            );
    }

    shouldDisableSubmit() {
        return (
            super.shouldDisableSubmit() ||
            this.passwordsDontMatch() ||
            this.passwordTooSimple()
        );
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
