import { HospitalService } from '../../../lib/hospitals/hospital.service';
import { combineLatest as observableCombineLatest, Subscription } from 'rxjs';
import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Patient } from '../../patients/patient.model';
import { PatientService } from '../../patients/patient.service';
import { Unsubscribe } from '@lib/utils/unsubscribe';
import { Appointment } from '@lib/appointments/appointment.model';
import { AppointmentsService } from '../appointments.service';
import { map } from 'rxjs/operators';
import { AppointmentFormFactory } from '../appointment-form/factories/appointment-form.factory';

@Component({
    selector: 'patient-appointments',
    templateUrl: './patient-appointments.component.html',
    styleUrls: ['./patient-appointments.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
@Unsubscribe()
export class PatientAppointmentsComponent implements OnInit {
    isLoading = true;
    isDeleting = false;
    showConfirmation = false;
    appointments: Appointment[];
    patient: Patient;
    subscriptions: Subscription[] = [];
    isIntegratedHospital = this.hospitalService.hospital.pipe(
        map(hospital => hospital.integrated),
    );
    private selectedAppointmentId: string;

    constructor(
        public hospitalService: HospitalService,
        private service: AppointmentsService,
        private patientService: PatientService,
        private activatedRoute: ActivatedRoute,
        private ref: ChangeDetectorRef,
        public appointmentFactory: AppointmentFormFactory,
    ) {}

    ngOnInit() {
        const routeSnapshot = this.activatedRoute.snapshot;
        const patientId = routeSnapshot.parent.params.id;

        this.selectedAppointmentId = routeSnapshot.queryParamMap.get(
            'appointment',
        );

        this.subscriptions = [
            observableCombineLatest(
                this.service.getAppointments$({ patientId }),
                this.patientService.getPatients$(),
            ).subscribe(([appointments, patientOverviews]) => {
                this.isLoading = appointments.isFetching;
                this.appointments = appointments.list;
                this.patient = patientOverviews.list
                    .map(overview => overview.patient)
                    .find(patient => patient.backendId === patientId);
                this.ref.detectChanges();
            }),

            this.service.fetchPatientAppointments(patientId).subscribe(),
            this.hospitalService.fetchHospital().subscribe(),
        ];
    }

    get selectedAppointment() {
        return this.appointments.find(
            appointment => appointment.id === this.selectedAppointmentId,
        );
    }

    get numberOfUpcomingAppointments(): number {
        const upcomingAppointments = this.appointments.filter(
            appointment => !appointment.isPast(),
        );

        return upcomingAppointments.length || null;
    }
}
