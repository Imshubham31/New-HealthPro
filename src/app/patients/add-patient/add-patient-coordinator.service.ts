import { CareModuleModel } from './care-module/care-module.model';
import {
    throwError as observableThrowError,
    BehaviorSubject,
    Subject,
    Observable,
} from 'rxjs';

import { catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { LocaliseService } from '@lib/localise/localise.service';
import {
    ToastService,
    ToastStyles,
} from '@lib/shared/components/toast/toast.service';
import { Surgery } from '../surgery.model';
import { Patient } from './../patient.model';
import { PatientService } from '../patient.service';
import { PatientOverview } from '../view-patient.model';
import { RestError } from '@lib/shared/services/error.pipe';

export enum AddPatientStages {
    PersonalDetails,
    CareModules,
    SurgeryDetails,
}

@Injectable()
export class AddPatientCoordinator {
    patient = new Patient();
    onComplete$ = new Subject();
    onCancel$ = new Subject();
    errors: RestError[] = [];
    stage$ = new BehaviorSubject<AddPatientStages>(
        AddPatientStages.PersonalDetails,
    );

    constructor(
        private patientService: PatientService,
        private localiseService: LocaliseService,
        private toastService: ToastService,
    ) {}

    getTitle() {
        switch (this.stage$.getValue()) {
            case AddPatientStages.PersonalDetails:
                return this.localiseService.fromKey('addNewPatient');
            case AddPatientStages.CareModules:
                return this.localiseService.fromKey('careModules');
            case AddPatientStages.SurgeryDetails:
                return this.localiseService.fromKey('surgeryInformation');
            default:
                return this.localiseService.fromKey('surgeryInformation');
        }
    }

    getSubtitle(): string | null {
        const firstName = this.patient.firstName
            ? this.patient.firstName
            : this.localiseService.fromKey('patient');
        const subtitle = `${this.localiseService.fromKey(
            'forPatient',
        )} ${firstName} ${this.patient.lastName}`;
        return this.stage$.getValue() !== AddPatientStages.PersonalDetails
            ? subtitle
            : null;
    }

    savePersonalDetails(patient: Patient) {
        this.errors = [];
        this.stage$.next(AddPatientStages.CareModules);
        this.patient = patient;
        this.patient.hospitalId = AuthenticationService.getUser().hospitalId;
        this.patient.documentsAccepted = [];
        this.patient.onboardingState = {
            hasUpdatedPassword: false,
            hasUpdatedProfilePicture: false,
            hasConsented: false,
            // hasFullyConsented: false,
        };
    }

    clearCareModule() {
        this.patient.careModuleId = undefined;
        this.patient.pathwayId = undefined;
    }

    saveCareModules(careModule: CareModuleModel) {
        this.patient.careModuleId = careModule.id;
        this.patient.pathwayId = careModule.pathwayId;
        this.patient.surgery = this.patient.surgery || {
            surgeon: null,
            startDateTime: null,
        };
        this.stage$.next(AddPatientStages.SurgeryDetails);
    }

    saveSurgery(surgery: Surgery): any {
        this.patient.surgery = surgery;
    }

    saveAllDetails(): Observable<PatientOverview> {
        this.errors = [];
        this.patient.hospitalId = AuthenticationService.getUser().hospitalId;

        return this.patientService.create(this.patient).pipe(
            tap((next: PatientOverview) => {
                this.patient = next.patient;
            }),
            catchError(error => {
                this.errors.push(error.error);
                this.stage$.next(AddPatientStages.PersonalDetails);
                return observableThrowError(this.errors);
            }),
        );
    }

    reset() {
        this.errors = [];
        this.patient = new Patient();
        this.stage$ = new BehaviorSubject<AddPatientStages>(
            AddPatientStages.PersonalDetails,
        );
    }

    finish() {
        this.onComplete$.next();
        this.toastService.show(
            null,
            this.localiseService.fromParams('newPatientSuccess', [
                `${this.patient.firstName} ${this.patient.lastName}`,
            ]),
            ToastStyles.Success,
        );
    }
}
