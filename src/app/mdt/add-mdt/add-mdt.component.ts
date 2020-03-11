import { ParticipantType } from '@lib/participants/participants.service';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PatientService } from '../../patients/patient.service';
import { PatientOverview } from '../../patients/view-patient.model';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { ModalControls } from '@lib/shared/components/modal/modal.service';
import { BaseForm, SetsUpForm } from '@lib/shared/services/base-form';
import { tap, catchError } from 'rxjs/operators';
import { ToastService } from '@lib/shared/components/toast/toast.service';
import { LocaliseService } from '@lib/localise/localise.service';
import { of } from 'rxjs';
import { MdtsHcps } from 'app/patients/patient.model';

@Component({
    templateUrl: './add-mdt.component.html',
    styleUrls: ['./add-mdt.component.scss'],
})
export class AddMdtComponent extends BaseForm
    implements SetsUpForm, ModalControls {
    @ViewChild('modal', { static: true }) modal: ModalWrapperComponent;
    formError: string;
    participantType = ParticipantType.HCP;
    patient: PatientOverview;
    mdtsHcps: MdtsHcps = null;

    constructor(
        private fb: FormBuilder,
        private patientService: PatientService,
        private toastService: ToastService,
        private localiseService: LocaliseService,
    ) {
        super();
    }

    get title() {
        return `${this.localiseService.fromKey(
            'mdts',
        )}/${this.localiseService.fromKey('hcps')}`;
    }

    open() {
        this.modal.openModal();
    }

    close() {
        super.cleanForm();
        this.formError = undefined;

        this.submitting = false;
        this.modal.closeModal();
    }

    startWithPatient(patient: PatientOverview) {
        this.patient = patient;
        this.setupForm();
        this.open();
    }

    setupForm(): void {
        this.form = this.fb.group({
            members: ['', [Validators.required, Validators.minLength(1)]],
        });
    }

    handleMdtMembersChanged(mdtMembers: MdtsHcps) {
        this.mdtsHcps = mdtMembers;
    }

    shouldDisableSubmit() {
        return !this.form.valid || this.submitting;
    }

    submit() {
        super.submit();
        this.submitting = true;
        this.patientService
            .updateMdtsAndHcps(this.patient.patient.backendId, this.mdtsHcps)
            .pipe(
                tap(res => {
                    this.toastService.show(
                        null,
                        this.localiseService.fromKey('newTeamSuccess'),
                    );
                }),
                catchError(err => {
                    this.toastService.show(
                        null,
                        this.localiseService.fromKey('newTeamFail'),
                    );
                    return of(err);
                }),
            )
            .subscribe(() => {
                this.patientService.fetchPatientsWithOutCache().subscribe();
                this.close();
            });
    }
}
