import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Patient } from '../patient.model';
import { Surgery } from '../surgery.model';

export class EditPatientFormGroup extends FormGroup {
    set value(_value: any) {}
    get value() {
        return this.buildPatient();
    }

    private static patientToControls(patient: Patient) {
        return {
            backendId: patient.backendId,
            idmsId: patient.idmsId,
            firstName: patient.firstName,
            lastName: patient.lastName,
            gender: patient.gender,
            dob: new Date(patient.dob),
            email: patient.email,
            phoneNumber: patient.phoneNumber,
            surgery: patient.surgery,
        };
    }

    constructor(integrated: boolean, patient: Patient) {
        super({
            backendId: new FormControl(patient.backendId, Validators.required),
            idmsId: new FormControl(patient.idmsId, Validators.required),
            firstName: new FormControl(
                { value: patient.firstName, disabled: integrated },
                [Validators.required, Validators.maxLength(30)],
            ),
            lastName: new FormControl(
                { value: patient.lastName, disabled: integrated },
                [Validators.required, Validators.maxLength(40)],
            ),
            gender: new FormControl(
                { value: patient.gender, disabled: integrated },
                Validators.required,
            ),
            dob: new FormControl(
                { value: patient.dob, disabled: integrated },
                Validators.required,
            ),
            email: new FormControl({ value: patient.email, disabled: true }),
            phoneNumber: new FormControl(
                patient.phoneNumber,
                Validators.minLength(3),
            ),
            surgery: new FormControl(patient.surgery),
        });
    }

    private buildPatient() {
        const rawValue = this.getRawValue();
        const surgery = new Surgery(
            rawValue.surgery.surgeon,
            rawValue.surgery.startDateTime,
        );
        const patient = new Patient();
        patient.backendId = rawValue.backendId;
        patient.idmsId = rawValue.idmsId;
        patient.firstName = rawValue.firstName;
        patient.lastName = rawValue.lastName;
        patient.gender = rawValue.gender;
        patient.dob = new Date(
            Date.UTC(
                rawValue.dob.getFullYear(),
                rawValue.dob.getMonth(),
                rawValue.dob.getDate(),
            ),
        ).toUTCString();
        patient.phoneNumber = rawValue.phoneNumber;
        patient.surgery = surgery;
        return patient;
    }

    setValue(patient: Patient, options?: any) {
        super.setValue(
            EditPatientFormGroup.patientToControls(patient),
            options,
        );
    }

    patchValue(patient: Patient, options?: any) {
        super.patchValue(
            EditPatientFormGroup.patientToControls(patient),
            options,
        );
    }

    reset(patient: Patient, options?: any) {
        super.reset(EditPatientFormGroup.patientToControls(patient), options);
    }
}
