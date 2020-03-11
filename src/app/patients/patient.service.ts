import { ChangePathwayState } from './change-pathway/change-pathway-coordinator';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as merge from 'lodash/merge';
import { concatMap, map, tap, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { AuthenticationService } from '@lib/authentication/authentication.service';
import { HeightRecord } from '@lib/goals/medical-record.model';
import { MDTService } from '../mdt/mdt.service';
import { Stores } from '@lib/utils/stores';
import { Patient, MdtsHcps } from './patient.model';
import { PatientsRestService } from './patients-rest.service';
import { PatientRestService } from './patient-rest.service';
import { PatientOverview } from './view-patient.model';
import { MDT } from '../mdt/mdt.model';
import { oc } from 'ts-optchain';
import { MDTs } from 'app/mdts/mdts.model';

@Injectable()
export class PatientService extends Stores.StoreService<PatientOverview> {
    private params = new HttpParams()
        .set('hospitalId', AuthenticationService.getUser().hospitalId)
        .set('includes', 'mdt');

    constructor(
        private patientsRestService: PatientsRestService,
        private patientRestService: PatientRestService,
        private mdtService: MDTService,
    ) {
        super();
    }

    getPatients$() {
        return this.store$;
    }

    getPatient$(id: string) {
        return this.store$.pipe(
            map(store => {
                const patient = store.list.find(
                    overview => overview.patient.backendId === id,
                );
                if (!patient) {
                    throw new Error('no patient found');
                }
                return patient;
            }),
            filter(value => Boolean(value)),
        );
    }

    fetchPatientWithId(id: string): Observable<PatientOverview> {
        super.setStateFetching();
        return this.patientsRestService
            .findOne<PatientOverview>(id, { subPath: '', params: this.params })
            .pipe(
                map(next => {
                    this.updateStoreWithEntity(next.data, 'patient.backendId');
                    return next.data;
                }),
                super.catchErrorAndReset(),
            );
    }

    fetchPatients(): Observable<PatientOverview[]> {
        if (!this.cache.isExpired) {
            return this.store$.pipe(map(store => store.list));
        }
        super.setStateFetching();
        return this.patientsRestService
            .find<PatientOverview>({ params: this.params })
            .pipe(
                map(next => {
                    this.store$.next({
                        ...this.store$.value,
                        list: next.data,
                        isFetching: false,
                    });
                    this.cache.updated();
                    return next.data;
                }),
                super.catchErrorAndReset(),
            );
    }

    assignMDTto(patient: PatientOverview, mdt: MDT) {
        return this.mdtService.assignMdtTo(patient.patient.backendId, mdt).pipe(
            tap(createdMdt => {
                const patientOverview = this.getPatient(
                    patient.patient.backendId,
                );
                patientOverview.patient.mdts.push(createdMdt);
                this.updateStoreWithEntity(
                    patientOverview,
                    'patient.backendId',
                );
            }),
        );
    }

    update(patient: Patient) {
        return this.patientsRestService.patch(patient.backendId, patient).pipe(
            tap(() => {
                const patientOverview = this.getPatient(patient.backendId);
                merge(patientOverview.patient, patient);
                this.updateStoreWithEntity(
                    patientOverview,
                    'patient.backendId',
                );
            }),
            super.catchErrorAndReset(),
        );
    }

    create(patient: Patient): Observable<PatientOverview> {
        super.setStateFetching();

        return this.patientsRestService.create(patient).pipe(
            concatMap(res => this.fetchPatientWithId(String(res.resourceId))),
            super.catchErrorAndReset(),
            tap(patientOverview => {
                this.store$.next({
                    ...this.store$.value,
                    isFetching: false,
                });
            }),
        );
    }

    getPatientLatestHeight(patientId: string): Observable<HeightRecord> {
        return this.patientsRestService.getLatestHeight(patientId).pipe(
            map(response => response.data),
            map(next => {
                return oc(next)[0].height({ unit: 'cm', value: 0 });
            }),
            super.catchErrorAndReset(),
        );
    }

    changePathway(patientId: string, data: ChangePathwayState) {
        const payload = {
            pathwayId: data.nextCareModule.pathwayId,
            caremoduleId: data.nextCareModule.id,
            surgery: data.surgery,
            personalMdt: data.mdtHcps ? data.mdtHcps.personalMdt : null,
            sharedMdtIds: data.mdtHcps ? data.mdtHcps.sharedMdtIds : null,
        };
        return this.patientsRestService.changePathway(patientId, payload).pipe(
            concatMap(res => this.fetchPatientWithId(patientId)),
            super.catchErrorAndReset(),
            tap(patientOverview => {
                this.store$.next({
                    ...this.store$.value,
                    isFetching: false,
                });
            }),
        );
    }

    deletePatient(patient: PatientOverview, reason: string) {
        return this.patientRestService
            .deletePatient(patient.patient.email, reason)
            .pipe(
                tap(() =>
                    this.removeEntityFromStore(patient, 'patient.backendId'),
                ),
            );
    }

    private getPatient(id: string) {
        return this.store$
            .getValue()
            .list.find(overview => overview.patient.backendId === id);
    }

    fetchPatientMdtsWithId(id: string): Observable<MDTs[]> {
        super.setStateFetching();
        return this.patientsRestService.getPatientMdtsWithId(id).pipe(
            map(response => {
                return response.data;
            }),
            super.catchErrorAndReset(),
        );
    }

    updateMdtsAndHcps(patientId, mdtsHcps: MdtsHcps): Observable<MdtsHcps> {
        super.setStateFetching();
        return this.patientsRestService
            .updatePatientMdtsWithId(patientId, mdtsHcps)
            .pipe(
                map(res => {}),
                super.catchErrorAndReset(),
            );
    }

    fetchPatientsWithOutCache(): Observable<PatientOverview[]> {
        super.setStateFetching();
        return this.patientsRestService
            .find<PatientOverview>({ params: this.params })
            .pipe(
                map(next => {
                    this.store$.next({
                        ...this.store$.value,
                        list: next.data,
                        isFetching: false,
                    });
                    this.cache.updated();
                    return next.data;
                }),
                super.catchErrorAndReset(),
            );
    }
}
