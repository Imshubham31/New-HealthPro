import { Component, Input } from '@angular/core';

import { Appointment } from '@lib/appointments/appointment.model';
import { AppointmentStatus } from '@lib/appointments/appointment-status.enum';
import { LocaliseService } from '@lib/localise/localise.service';

@Component({
    selector: 'patient-appointments-list-item',
    templateUrl: './patient-appointments-list-item.component.html',
    styleUrls: ['./patient-appointments-list-item.component.scss'],
})
export class PatientAppointmentsListItemComponent {
    @Input() appointment: Appointment;

    get title() {
        // TODO: We shouldn't be if-ing. Need to refactor to dynamic component
        if (!this.appointment.isIntegrated) {
            return this.appointment.title;
        }
        return this.appointment.title || this.localise.fromKey('appointment');
    }

    constructor(private localise: LocaliseService) {}

    getAppointmentStatusText() {
        const map = {
            [AppointmentStatus.pending]: 'appointmentAwaitingPatientResponse',
            [AppointmentStatus.accepted]: 'appointmentAcceptedByPatient',
            [AppointmentStatus.scheduled]: 'scheduled',
            [AppointmentStatus.declined]: 'appointmentDeclinedByPatient',
            [AppointmentStatus.updated]: 'updated',
            [AppointmentStatus.attended]: 'attended',
            [AppointmentStatus.missed]: 'missed',
        };

        return map[this.appointment.status];
    }
}
