import { Injectable } from '../../../node_modules/@angular/core';
import { Stores } from '@lib/utils/stores';
import { Appointment } from '@lib/appointments/appointment.model';
import {
    Observable,
    combineLatest,
    zip,
    throwError,
} from '../../../node_modules/rxjs';
import {
    map,
    tap,
    mergeMap,
    catchError,
} from '../../../node_modules/rxjs/operators';
import { AppointmentStatus } from '@lib/appointments/appointment-status.enum';
import {
    AppointmentsRestService,
    AppointmentApi,
} from '@lib/appointments/appointments-rest.service';
import { PatientService } from '../patients/patient.service';
import { PathWayService } from '@lib/pathway/pathway.service';
import { AppointmentsTranslator } from '@lib/appointments/appointments.translator';
import {
    ToastService,
    ToastStyles,
} from '@lib/shared/components/toast/toast.service';
import { LocaliseService } from '@lib/localise/localise.service';

@Injectable()
export class AppointmentsService extends Stores.StoreService<Appointment> {
    constructor(
        private appointmentsRestService: AppointmentsRestService,
        private patientService: PatientService,
        private pathwayService: PathWayService,
        private toastService: ToastService,
        private localise: LocaliseService,
    ) {
        super();
    }

    getAppointments$({ patientId = null } = {}) {
        return this.store$.pipe(
            map(appointments => {
                let list = appointments.list;
                if (patientId) {
                    list = list.filter(
                        appointment =>
                            appointment.patientDetails.backendId === patientId,
                    );
                }
                return {
                    ...appointments,
                    list,
                };
            }),
        );
    }

    getAppointment$(id: string) {
        return this.store$.pipe(
            map(store => store.list.find(item => item.id === id)),
        );
    }

    fetchAppointment(id) {
        super.setStateFetching();
        return this.appointmentsRestService.findOne<AppointmentApi>(id).pipe(
            map(res => AppointmentsTranslator.fromApi(res.data)),
            tap(appt => this.updateStoreWithEntity(appt)),
            super.catchErrorAndReset(),
        );
    }

    fetchPatientAppointments(id) {
        super.setStateFetching();
        return zip(
            this.appointmentsRestService.findForPatient(id),
            this.patientService.fetchPatientWithId(id),
        ).pipe(
            mergeMap(([appointments, { patient }]) =>
                this.pathwayService
                    .getPathwayById$(Number(patient.pathwayId))
                    .pipe(
                        map(pathway =>
                            appointments.map(appt =>
                                AppointmentsTranslator.fromApi(appt),
                            ),
                        ),
                    ),
            ),
            this.filterByStatuses(),
            tap(list => {
                this.store$.next({
                    ...this.store$.value,
                    list,
                    isFetching: false,
                });
                this.cache.updated();
            }),
            super.catchErrorAndReset(),
        );
    }
    fetchAppointmentsForHCP() {
        return this.fetch$(
            combineLatest(
                this.appointmentsRestService.find<AppointmentApi>(),
                this.pathwayService.getPathways$(),
            ).pipe(
                map(([appointments, pathways]) =>
                    appointments.data.map(appointment =>
                        AppointmentsTranslator.fromApi(appointment),
                    ),
                ),
            ),
        );
    }

    private filterByStatuses() {
        const statusesToRemove = [
            AppointmentStatus.deleted,
            AppointmentStatus.cancelled,
        ];
        return map((appointments: Appointment[]) => {
            return appointments.filter(
                appointment => !statusesToRemove.includes(appointment.status),
            );
        });
    }
    private fetch$(observable: Observable<Appointment[]>) {
        this.store$.next({
            ...this.store$.value,
            isFetching: true,
        });
        return observable.pipe(
            this.filterByStatuses(),
            tap(appointments => {
                this.store$.next({
                    ...this.store$.value,
                    list: appointments,
                    isFetching: false,
                });
            }),
        );
    }
    saveAppointment(appointment: Appointment, asNew = false) {
        this.store$.next({
            ...this.store$.value,
            isSaving: true,
            errors: [],
        });
        const task = asNew
            ? this.createAppointment(appointment)
            : this.updateAppointment(appointment);
        return task.pipe(
            tap(updated => super.updateStoreWithEntity(updated)),
            catchError(err => {
                this.store$.next({
                    ...this.store$.value,
                    isSaving: false,
                    errors: [err.message],
                });
                return throwError(err);
            }),
        );
    }
    private createAppointment(appointment: Appointment) {
        return this.appointmentsRestService.createAppointment(appointment).pipe(
            tap(res => {
                super.updateStoreWithEntity(res);
                this.toastService.show(
                    null,
                    this.localise.fromKey('createAppointmentSuccess'),
                    ToastStyles.Success,
                );
            }),
            catchError(err => {
                this.store$.next({
                    ...this.store$.value,
                    errors: [err],
                });
                throw new Error(
                    this.localise.fromParams('createEntityError', [
                        'appointment',
                    ]),
                );
            }),
            super.catchErrorAndReset(),
        );
    }
    private updateAppointment(appointment: Appointment) {
        return this.appointmentsRestService.updateAppointment(appointment).pipe(
            tap(updatedAppointment => {
                this.store$.next({
                    ...this.store$.value,
                    isSaving: false,
                    list: this.store$.value.list.map(a =>
                        a.id === updatedAppointment.id ? updatedAppointment : a,
                    ),
                });
                this.toastService.show(
                    null,
                    this.localise.fromKey('updateAppointmentSuccess'),
                );
            }),
            catchError(() => {
                throw new Error(
                    this.localise.fromKey('updateAppointmentError'),
                );
            }),
        );
    }
    deleteAppointment(appointment: Appointment) {
        return this.appointmentsRestService.deleteAppointment(appointment).pipe(
            tap(() => {
                this.toastService.show(
                    null,
                    this.localise.fromKey('deleteAppointmentSuccess'),
                );
                this.store$.next({
                    ...this.store$.value,
                    list: this.store$.value.list.filter(
                        existingAppointment =>
                            String(existingAppointment.id) !== appointment.id,
                    ),
                });
            }),
        );
    }
    resetErrors() {
        this.store$.next({
            ...this.store$.value,
            errors: [],
        });
    }
}
