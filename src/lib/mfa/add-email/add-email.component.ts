import { Component } from '@angular/core';
import { MfaCoordinatorService } from '../mfa-coordinator.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SetsUpForm } from '@lib/shared/services/base-form';
import { MfaService } from '../mfa.service';
import { finalize } from 'rxjs/operators';
import { MfaMethod, MfaOption } from '../mfa-rest.service';
import {
    ToastService,
    ToastStyles,
} from '@lib/shared/components/toast/toast.service';
import { LocaliseService } from '@lib/localise/localise.service';
import { NoWhitespaceValidator } from '@lib/utils/validators';

@Component({
    selector: 'add-email',
    styleUrls: ['./add-email.component.scss'],
    template: `
        <form [formGroup]="form" (ngSubmit)="submit()">
            <a class="link" (click)="goBack()">
                <i class="fa fa-arrow-left flip-on-rtl" aria-hidden="true"></i>
                {{ 'backToMethod' | localise }}
            </a>
            <h2>{{ 'confirmEmail' | localise }}</h2>
            <p>{{ 'whichEmail' | localise }}</p>
            <input
                type="email"
                formControlName="email"
                class="form-input input-lg"
            />
            <p>{{ 'emailDisclaimer' | localise }}</p>
            <button
                class="btn btn-primary btn-block btn-lg"
                [disabled]="shouldDisableSubmit()"
                [class.loading]="submitting"
            >
                {{ 'sendCode' | localise }}
            </button>
        </form>
    `,
})
export class AddEmailComponent implements SetsUpForm {
    form: FormGroup;
    submitting = false;

    constructor(
        private mfaCoordinator: MfaCoordinatorService,
        private fb: FormBuilder,
        private mfaService: MfaService,
        private toastService: ToastService,
        private localiseService: LocaliseService,
    ) {
        this.setupForm();
    }

    setupForm() {
        this.form = this.fb.group({
            email: [
                this.mfaCoordinator.state.value.loginEmail,
                [
                    Validators.required,
                    Validators.email,
                    NoWhitespaceValidator(),
                ],
            ],
        });
    }

    submit() {
        this.submitting = true;
        this.form.controls['email'].disable();
        const option: MfaOption = {
            mfaMethod: MfaMethod.email,
            mfaDestination: this.form.value.email,
            mfaPrimary: true,
        };
        this.mfaService
            .updateMfaOption(option)
            .pipe(
                finalize(() => {
                    this.submitting = false;
                    this.form.get('email').enable();
                }),
            )
            .subscribe(
                res => {
                    this.mfaCoordinator.updateState({ option: res });
                    this.mfaCoordinator.goToEnterCode();
                },
                error =>
                    this.toastService.show(
                        null,
                        this.localiseService.fromKey('mfaUnableToVerifyEmail'),
                        ToastStyles.Error,
                    ),
            );
    }

    goBack() {
        if (!this.submitting) {
            this.mfaCoordinator.goToSelectMethod();
        }
    }

    shouldDisableSubmit() {
        return !this.form.valid || this.submitting;
    }
}
