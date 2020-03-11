import { finalize, tap } from 'rxjs/operators';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BaseForm, SetsUpForm } from '@lib/shared/services/base-form';
import { Surgery } from '../../surgery.model';
import { AddPatientCoordinator } from '../add-patient-coordinator.service';
import { Surgeon } from './surgeon.model';
import { Subscription } from 'rxjs';
import { Patient } from 'app/patients/patient.model';
import { Unsubscribe } from '@lib/utils/unsubscribe';

@Component({
    selector: 'surgery-details',
    templateUrl: './surgery-details.component.html',
})
@Unsubscribe()
export class SurgeryDetailsComponent extends BaseForm implements SetsUpForm {
    @Output() onCancel = new EventEmitter();
    loadingParticipants = true;
    surgeons: Surgeon[];
    subscriptions: Subscription[] = [];
    patient: Patient;

    constructor(
        private fb: FormBuilder,
        private addPatientCoordinator: AddPatientCoordinator,
    ) {
        super();
        this.setupForm();
    }

    setupForm() {
        const surgery = this.addPatientCoordinator.patient.surgery;
        this.form = this.fb.group({
            surgery: [surgery ? surgery : null],
        });
    }

    previous() {
        this.cleanForm();
        this.onCancel.next();
    }

    submit() {
        this.submitting = true;
        const model = new Surgery(
            this.form.value.surgery.surgeon,
            this.form.value.surgery.startDateTime,
        );
        this.addPatientCoordinator.saveSurgery(model);
        this.addPatientCoordinator
            .saveAllDetails()
            .pipe(
                tap(() => this.addPatientCoordinator.finish()),
                finalize(() => ((this.submitting = false), this.cleanForm())),
            )
            .subscribe();
    }

    shouldDisableSubmit() {
        return !this.form.valid;
    }
}
