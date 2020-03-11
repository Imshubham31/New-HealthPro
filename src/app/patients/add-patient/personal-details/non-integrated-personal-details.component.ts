import { Component } from '@angular/core';
import { AddPatientPersonalDetailsComponent } from 'app/patients/add-patient/personal-details/add-patient-personal-details.component';
import { LocaliseService } from '@lib/localise/localise.service';
import { AddPatientCoordinator } from 'app/patients/add-patient/add-patient-coordinator.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NoWhitespaceValidator } from '@lib/utils/validators';
import { HospitalType } from '@lib/hospitals/hospital.model';

@Component({
    templateUrl: './non-integrated-personal-details.component.html',
    styleUrls: ['./add-patient-personal-details.component.scss'],
})
export class NonIntegratedPersonalDetailsComponent extends AddPatientPersonalDetailsComponent {
    type = HospitalType.NonIntegrated;

    constructor(
        protected fb: FormBuilder,
        protected addPatientCoordinator: AddPatientCoordinator,
        protected localise: LocaliseService,
    ) {
        super(fb, addPatientCoordinator, localise);
    }

    currentDate = new Date();

    setupForm(): void {
        const patient = this.addPatientCoordinator.patient;

        this.form = this.fb.group({
            firstName: [
                patient.firstName,
                [
                    Validators.required,
                    Validators.maxLength(30),
                    NoWhitespaceValidator(),
                ],
            ],
            lastName: [
                patient.lastName,
                [
                    Validators.required,
                    Validators.maxLength(40),
                    NoWhitespaceValidator(),
                ],
            ],
            gender: [patient.gender || 'unknown', [Validators.required]],
            dob: [
                patient.dob ? new Date(patient.dob) : null,
                Validators.required,
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
        patient.firstName = this.form.value.firstName;
        patient.lastName = this.form.value.lastName;
        patient.gender = this.form.value.gender;
        patient.dob = this.getDOBAsUTC().toUTCString();
        patient.email = this.form.value.email;
        patient.phoneNumber = this.form.value.phone;
        patient.language = this.form.value.language;
        return patient;
    }

    private getDOBAsUTC() {
        const dob = this.form.value.dob;
        return new Date(
            Date.UTC(dob.getFullYear(), dob.getMonth(), dob.getDate()),
        );
    }
}
