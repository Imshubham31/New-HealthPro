import { combineLatest as observableCombineLatest, Subscription } from 'rxjs';

import { tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppCoordinator } from '@lib/app-coordinator/app-coordinator.service';
import { Unsubscribe } from '@lib/utils/unsubscribe';
import { Appointment } from '@lib/appointments/appointment.model';
import { AppointmentsService } from './appointments.service';
import { isAppointmentVisibleToUser } from './specifications/appointment-visible-by-user';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { HospitalService } from '@lib/hospitals/hospital.service';
import { AppointmentFormFactory } from './appointment-form/factories/appointment-form.factory';

@Component({
    selector: 'appointments',
    templateUrl: './appointments.component.html',
    styleUrls: ['./appointments.component.scss'],
})
@Unsubscribe()
export class AppointmentsComponent implements OnInit {
    appointments: Appointment[];
    isLoading = true;
    subscriptions: Subscription[] = [];

    constructor(
        public service: AppointmentsService,
        private router: Router,
        public hospitalService: HospitalService,
        public appointmentFactory: AppointmentFormFactory,
    ) {}

    ngOnInit(): void {
        AppCoordinator.loadingOverlay.next({ loading: true });

        this.subscriptions = [
            observableCombineLatest(
                this.service.fetchAppointmentsForHCP(),
                this.service.getAppointments$(),
                this.hospitalService.fetchHospital(),
            )
                .pipe(
                    tap(([appointments, appointmentsState]) => {
                        AppCoordinator.loadingOverlay.next({ loading: false });
                        this.isLoading = appointmentsState.isFetching;
                        this.appointments = appointmentsState.list.filter(
                            appointment =>
                                isAppointmentVisibleToUser(
                                    appointment,
                                    AuthenticationService.getUser(),
                                ),
                        );
                    }),
                )
                .subscribe(),
        ];
    }

    handleAppointmentSelected(appointment: Appointment) {
        this.router.navigate(['/appointments', appointment.id]);
    }
}
