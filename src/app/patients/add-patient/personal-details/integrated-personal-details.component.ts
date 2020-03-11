import { Component } from '@angular/core';
import { AddPatientPersonalDetailsComponent } from 'app/patients/add-patient/personal-details/add-patient-personal-details.component';
import { FormBuilder } from '@angular/forms';
import { AddPatientCoordinator } from 'app/patients/add-patient/add-patient-coordinator.service';
import { LocaliseService } from '@lib/localise/localise.service';
import { Validators } from '@angular/forms';
import { NoWhitespaceValidator } from '@lib/utils/validators';
import { HospitalType } from '@lib/hospitals/hospital.model';

@Component({
    templateUrl: './integrated-personal-details.component.html',
    styleUrls: ['./add-patient-personal-details.component.scss'],
})
export class IntegratedPersonalDetailsComponent extends AddPatientPersonalDetailsComponent {
    type = HospitalType.Integrated;

    constructor(
        protected fb: FormBuilder,
        protected addPatientCoordinator: AddPatientCoordinator,
        protected localise: LocaliseService,
    ) {
        super(fb, addPatientCoordinator, localise);
    }

    setupForm(): void {
        const patient = this.addPatientCoordinator.patient;
        if (!patient.integrated) {
            patient.integrated = { mrn: '' };
        }

        this.form = this.fb.group({
            mrn: [patient.integrated.mrn, [Validators.required]],
            lastName: [
                patient.lastName,
                [
                    Validators.required,
                    Validators.maxLength(40),
                    NoWhitespaceValidator(),
                ],
            ],
            email: [
                patient.email,
                [
                    Validators.required,
                    Validators.email,
                    Validators.maxLength(100),
                ],
            ],
            phone: [patient.phoneNumber, [Validators.minLength(3)]],
            language: [patient.language, Validators.required],
        });
        this.form.markAsDirty();
    }

    buildPatient() {
        const patient = this.addPatientCoordinator.patient;
        patient.integrated = { mrn: this.form.value.mrn };
        patient.lastName = this.form.value.lastName;
        patient.email = this.form.value.email;
        patient.phoneNumber = this.form.value.phone;
        patient.language = this.form.value.language;
        return patient;
    }
}
