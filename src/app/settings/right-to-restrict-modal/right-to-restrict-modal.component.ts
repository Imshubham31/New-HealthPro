import { AuthenticationService } from '@lib/authentication/authentication.service';
import { ToastStyles } from '@lib/shared/components/toast/toast.service';
import { ToastService } from '@lib/shared/components/toast/toast.service';
import { UserPrivacyService } from './../user-privacy.service';
import { LocaliseService } from '@lib/localise/localise.service';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { BaseForm } from '@lib/shared/services/base-form';
import { ModalControls } from '@lib/shared/components/modal/modal.service';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { FormBuilder, Validators } from '@angular/forms';
// prettier-ignore
import { PasswordRequiredDialogComponent } from '../password-required-dialog/password-required-dialog.component';
import { HospitalService } from '@lib/hospitals/hospital.service';

export enum RightToRestrictReasons {
    DataAccuracy = 'dataAccuracy',
    UnlawfulProcessing = 'unlawfulProcessing',
    LegalClaim = 'legalClaim',
}

@Component({
    selector: 'right-to-restrict-modal',
    templateUrl: './right-to-restrict-modal.component.html',
    styles: [
        `
            fieldset {
                padding-bottom: 2rem;
            }
            textarea {
                height: auto;
                resize: none;
            }
            .form-label {
                font-weight: bold;
            }
        `,
    ],
})
export class RightToRestrictModalComponent extends BaseForm
    implements ModalControls, OnInit {
    restrictText: string;

    options = [
        RightToRestrictReasons.DataAccuracy,
        RightToRestrictReasons.UnlawfulProcessing,
        RightToRestrictReasons.LegalClaim,
    ];
    constructor(
        private fb: FormBuilder,
        private modalService: ModalService,
        private localiseService: LocaliseService,
        private userPrivacyService: UserPrivacyService,
        private toastService: ToastService,
        private hospitalService: HospitalService,
    ) {
        super();
        this.setupForm();
    }
    @ViewChild('modal', { static: true }) modal: ModalWrapperComponent;

    ngOnInit() {
        this.hospitalService.hospital.subscribe(hospital => {
            this.restrictText = hospital.integrated
                ? this.localiseService.fromKey(
                      'rightToRestrictConfirmationDescription',
                  )
                : this.localiseService.fromKey(
                      'rightToRestrictConfirmationDescriptionNonIntegrated',
                  );
        });
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
            gdprOptions: ['', [Validators.required]],
            gdprExplanation: [
                { value: undefined, disabled: true },
                [Validators.required],
            ],
        });
        this.form.get('gdprOptions').valueChanges.subscribe(value => {
            if (value) {
                this.form.get('gdprExplanation').enable();
            } else {
                this.form.get('gdprExplanation').disable();
            }
        });
    }

    submit() {
        super.submit();
        this.submitting = true;
        this.userPrivacyService
            .initiateRightToRestrictProcessing$(
                this.form.value.gdprOptions,
                this.form.value.gdprExplanation,
            )
            .subscribe(
                () => {
                    this.submitting = false;
                    AuthenticationService.setIsRestrictedRequested();
                    this.modal.closeModal();
                    this.toastService.show(
                        this.localiseService.fromKey(
                            'requestRestrictionSubmitted',
                        ),
                        undefined,
                        ToastStyles.Success,
                    );
                },
                error => {
                    this.submitting = false;
                    this.formError = error.error;
                },
            );
    }

    showPasswordConfirmation() {
        const modal = this.modalService.create<PasswordRequiredDialogComponent>(
            PasswordRequiredDialogComponent,
            {
                title: this.localiseService.fromKey(
                    'rightToRestrictConfirmationTitle',
                ),
                subtitle: this.restrictText,
            },
        );
        modal.open();
        modal.onSuccess.subscribe(() => this.submit());
    }
}
