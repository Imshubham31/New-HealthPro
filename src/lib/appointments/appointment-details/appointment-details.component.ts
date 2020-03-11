import { Subscription, combineLatest, of } from 'rxjs';
import {
    Component,
    Type,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';
import { LocalisedDatePipe } from '@lib/shared/services/localise-date.pipe';
import { LocaliseService } from '@lib/localise/localise.service';
import { DetailsComponent } from './appointment-details';
import { ActivatedRoute } from '@angular/router';
import { AppointmentsService } from 'app/appointments/appointments.service';
import { flatMap } from 'rxjs/operators';
import { Unsubscribe } from '@lib/utils/unsubscribe';
import { NonIntegratedAppointmentDetailsComponent } from './non-integrated/non-integrated-appointment-details.component';
import { IntegratedAppointmentDetailsComponent } from './integrated/integrated-appointment-details.component';
import { Appointment } from '../appointment.model';

@Component({
    selector: 'appointment-details',
    template: `
        <ng-container *ngxComponentOutlet="component"></ng-container>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
@Unsubscribe()
export class AppointmentDetailsComponent extends DetailsComponent
    implements OnInit {
    subscriptions: Subscription[];
    component: Type<DetailsComponent>;

    constructor(
        protected datePipe: LocalisedDatePipe,
        protected localise: LocaliseService,
        protected appointmentService: AppointmentsService,
        private route: ActivatedRoute,
        private ref: ChangeDetectorRef,
    ) {
        super(datePipe, localise);
    }
    ngOnInit(): void {
        this.subscriptions = [
            combineLatest(
                this.route.params,
                this.appointmentService.getAppointments$(),
            )
                .pipe(
                    flatMap(([params, store]) => {
                        if (!params.id || store.list.length === 0) {
                            return of();
                        }

                        return this.appointmentService.getAppointment$(
                            params.id,
                        );
                    }),
                )
                .subscribe((appointment: Appointment) => {
                    if (!appointment) {
                        return;
                    }
                    this.appointment = appointment;
                    this.component = this.appointment.isIntegrated
                        ? IntegratedAppointmentDetailsComponent
                        : NonIntegratedAppointmentDetailsComponent;
                    this.ref.detectChanges();
                }),
        ];
    }
}
