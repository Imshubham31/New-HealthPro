import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MfaCoordinatorService } from '../mfa-coordinator.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { SetsUpForm } from '@lib/shared/services/base-form';
import { Masks } from '@lib/utils/masks';
import { MfaService } from '../mfa.service';
import { MfaMethod, MfaOption } from '../mfa-rest.service';
import { finalize } from 'rxjs/operators';
import {
    ToastService,
    ToastStyles,
} from '../../shared/components/toast/toast.service';
import { LocaliseService } from '@lib/localise/localise.service';

@Component({
    selector: 'add-phone',
    styleUrls: ['./add-phone.component.scss'],
    template: `
        <form [formGroup]="form" (ngSubmit)="submit()">
            <a class="link" (click)="goBack()">
                <i class="fa fa-arrow-left flip-on-rtl" aria-hidden="true"></i>
                {{ 'backToMethod' | localise }}
            </a>
            <h2>{{ 'addPhone' | localise }}</h2>
            <p>{{ 'whichPhone' | localise }}</p>
            <input
                formControlName="phone"
                class="form-input input-lg"
                #phoneNumberField
            />
            <p>{{ 'phoneDisclaimer' | localise }}</p>
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
export class AddPhoneComponent implements SetsUpForm, AfterViewInit {
    @ViewChild('phoneNumberField', { static: true }) phoneNumberField: any;
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

    ngAfterViewInit(): void {
        Masks.mfaPhone(this.phoneNumberField.nativeElement);
    }

    setupForm() {
        this.form = this.fb.group({
            phone: [
                '',
                [Validators.required, Validators.pattern(/^\+[1-9]\d{6,14}$/)],
            ],
        });
    }

    submit() {
        this.submitting = true;
        this.form.get('phone').disable();
        const option: MfaOption = {
            mfaMethod: MfaMethod.sms,
            mfaDestination: this.form.value.phone,
            mfaPrimary: true,
        };
        this.mfaService
            .updateMfaOption(option)
            .pipe(
                finalize(() => {
                    this.submitting = false;
                    this.form.get('phone').enable();
                }),
            )
            .subscribe(
                res => {
                    this.mfaCoordinator.updateState({ option: res });
                    this.mfaCoordinator.goToEnterCode();
                },
                () =>
                    this.toastService.show(
                        null,
                        this.localiseService.fromKey(
                            'mfaUnableToVerifyPhoneNumber',
                        ),
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
