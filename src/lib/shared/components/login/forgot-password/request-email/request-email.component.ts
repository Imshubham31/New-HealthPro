import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocaliseService } from '@lib/localise/localise.service';
import { SetsUpForm } from '@lib/shared/services/base-form';

import { ModalService } from '../../../modal/modal.service';
import { PasswordConfirmationModalComponent } from '../password-confirmation-modal/password-confirmation-modal.component';
import { RequestEmailService } from './request-email.service';

@Component({
    moduleId: module.id,
    selector: 'request-email',
    templateUrl: 'request-email.component.html',
})
export class RequestEmailComponent implements SetsUpForm {
    resetPasswordForm: FormGroup;
    submitting = false;
    formError: string;
    email: string;

    constructor(
        public requestEmailService: RequestEmailService,
        private fb: FormBuilder,
        private router: Router,
        private localiseService: LocaliseService,
        private modalService: ModalService,
    ) {
        this.setupForm();
    }

    setupForm() {
        this.resetPasswordForm = this.fb.group({
            email: [
                '',
                [
                    Validators.required,
                    Validators.email,
                    Validators.maxLength(100),
                ],
            ],
        });
    }

    backToLogin() {
        this.router.navigate(['/login']);
    }

    submit() {
        this.submitting = true;
        this.requestEmailService
            .sendPasswordEmail(this.resetPasswordForm.value.email)
            .subscribe(
                () => {
                    this.email = this.resetPasswordForm.value.email;
                    this.showConfirmationModal();
                },
                error => {
                    this.formError =
                        error.error.code === 400
                            ? this.localiseService.fromKey('invalidEmailError')
                            : error.error.message;
                },
                () => (this.submitting = false),
            );
    }

    showConfirmationModal() {
        this.modalService
            .create<PasswordConfirmationModalComponent>(
                PasswordConfirmationModalComponent,
                {
                    title: this.localiseService.fromKey('emailSent'),
                    subtitle: this.localiseService.fromParams(
                        'emailConfirmation',
                        [this.email],
                    ),
                },
            )
            .open();
    }

    shouldDisableSubmit() {
        return !this.resetPasswordForm.valid || this.submitting;
    }
}
