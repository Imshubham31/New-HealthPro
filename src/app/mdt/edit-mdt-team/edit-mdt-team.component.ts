import { FormBuilder, Validators } from '@angular/forms';
import { BaseForm } from '@lib/shared/services/base-form';
import { RestrictProcessingPipe } from '@lib/shared/services/restricted-user.pipe';
import { Component, Input, ViewChild } from '@angular/core';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { ModalControls } from '@lib/shared/components/modal/modal.service';
import { PatientOverview } from './../../patients/view-patient.model';
import { PatientService } from 'app/patients/patient.service';
import { MdtsHcps } from 'app/patients/patient.model';
import { MDTs } from 'app/mdts/mdts.model';

@Component({
    templateUrl: './edit-mdt-team.component.html',
    styleUrls: ['./edit-mdt-team.component.scss'],
})
export class EditMdtTeamComponent extends BaseForm implements ModalControls {
    mdtsHcps: MdtsHcps = null;
    @ViewChild('modal', { static: true }) modal: ModalWrapperComponent;
    @Input() patient: PatientOverview;
    formError: string;

    constructor(
        private fb: FormBuilder,
        public restrictProcessingPipe: RestrictProcessingPipe,
        private patientService: PatientService,
    ) {
        super();
    }

    handleMdtMembersChanged(mdtMembers: MdtsHcps) {
        this.mdtsHcps = mdtMembers;
    }

    setupForm(): void {
        this.form = this.fb.group({
            mdt: ['', [Validators.required, Validators.minLength(1)]],
        });
    }

    open() {
        this.modal.openModal();
    }

    start() {
        this.patientService
            .fetchPatientMdtsWithId(this.patient.patient.backendId)
            .subscribe((data: MDTs[]) => {
                this.setupForm();
                this.form.get('mdt').setValue(data);
                this.open();
            });
    }

    close() {
        this.cleanForm();
        this.submitting = false;
        this.formError = undefined;
        this.modal.closeModal();
    }

    submit(): boolean {
        if (!this.form.valid) {
            return false;
        }
        this.submitting = true;
        this.patientService
            .updateMdtsAndHcps(this.patient.patient.backendId, this.mdtsHcps)
            .subscribe(
                next => {
                    this.patientService
                        .fetchPatientsWithOutCache()
                        .subscribe(() => {
                            this.patientService
                                .fetchPatientMdtsWithId(
                                    this.patient.patient.backendId,
                                )
                                .subscribe(data => {});
                        });
                    this.close();
                },
                error => {
                    this.submitting = false;
                },
            );
        return true;
    }

    resetError() {
        if (this.formError) {
            this.formError = undefined;
        }
    }
}
