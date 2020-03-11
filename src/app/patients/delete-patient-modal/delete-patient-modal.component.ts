import { PatientService } from 'app/patients/patient.service';
import { PasswordRequiredDialogComponent } from 'app/settings/password-required-dialog/password-required-dialog.component';
import { Validators, FormBuilder } from '@angular/forms';
import { Component, ViewChild, Input } from '@angular/core';
import { ToastStyles } from '@lib/shared/components/toast/toast.service';
import { ToastService } from '@lib/shared/components/toast/toast.service';
import { LocaliseService } from '@lib/localise/localise.service';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { BaseForm } from '@lib/shared/services/base-form';
import { ModalControls } from '@lib/shared/components/modal/modal.service';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { PatientOverview } from '../view-patient.model';

export enum DeletionReasons {
    ConsentNotProvided = 'consentNotProvided',
    EntryError = 'entryError',
    DuplicatePatient = 'duplicatePatient',
    Other = 'other',
}

@Component({
    selector: 'delete-patient-modal',
    templateUrl: './delete-patient-modal.component.html',
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
export class DeletePatientModalComponent extends BaseForm
    implements ModalControls {
    @Input() patient: PatientOverview;
    options = [
        DeletionReasons.ConsentNotProvided,
        DeletionReasons.EntryError,
        DeletionReasons.DuplicatePatient,
        DeletionReasons.Other,
    ];
    constructor(
        private fb: FormBuilder,
        private modalService: ModalService,
        private localiseService: LocaliseService,
        private toastService: ToastService,
        private patientService: PatientService,
    ) {
        super();
        this.setupForm();
    }
    @ViewChild('modal', { static: true }) modal: ModalWrapperComponent;

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
            deletionReason: ['', [Validators.required]],
        });
    }

    submit() {
        super.submit();
        this.submitting = true;
        this.patientService
            .deletePatient(this.patient, this.form.value.deletionReason)
            .subscribe(
                () => {
                    this.submitting = false;
                    this.modal.closeModal();
                    this.toastService.show(
                        this.localiseService.fromParams('deletionSuccess', [
                            this.patient.patient.fullName,
                        ]),
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
                title: this.localiseService.fromParams(
                    'doYouWantToDeletePatient',
                    [this.patient.patient.fullName],
                ),
                subtitle: this.localiseService.fromKey(
                    'personWillBeRemovedFromRecords',
                ),
            },
        );
        modal.open();
        modal.onSuccess.subscribe(() => this.submit());
    }
}
