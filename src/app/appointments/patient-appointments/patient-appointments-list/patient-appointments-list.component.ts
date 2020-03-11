import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';

import { Appointment } from '@lib/appointments/appointment.model';
import { LocaliseService } from '@lib/localise/localise.service';
import { Router } from '@angular/router';
import { DateUtils } from '@lib/utils/date-utils';

class AppointmentGroup {
    constructor(public name: string, public appointments: Array<Appointment>) {}
}

@Component({
    selector: 'patient-appointments-list',
    templateUrl: './patient-appointments-list.component.html',
    styleUrls: ['./patient-appointments-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientAppointmentsListComponent implements OnChanges {
    @Input() appointments: Appointment[] = [];
    groups = [];

    constructor(private localize: LocaliseService, private router: Router) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.appointments) {
            this.groups = [
                ...this.getUpcomingAppointmentGroups(),
                this.getPastAppointmentsGroup(),
            ];
        }
    }

    handleAppointmentSelected(appointment: Appointment) {
        this.router.navigate([
            `appointments/user/${appointment.patientId}`,
            { outlets: { master: 'all', detail: appointment.id } },
        ]);
    }

    getAppointmentClass(appointment: Appointment) {
        return {
            selected: this.router.isActive(
                `/appointments/user/${
                    appointment.patientId
                }/(master:all//detail:${appointment.id})`,
                true,
            ),
            past: appointment.isPast(),
        };
    }

    private isAppointmentFromThisYear(appointment: Appointment) {
        return appointment.date.getFullYear() === new Date().getFullYear();
    }

    private getPastAppointments() {
        return this.appointments.filter(appointment => appointment.isPast());
    }

    private getUpcomingAppointments() {
        return this.appointments.filter(appointment => !appointment.isPast());
    }

    private getUpcomingAppointmentGroups(): Array<AppointmentGroup> {
        const dateAscending = (a, b) => a.date.getTime() - b.date.getTime();

        return [...this.getUpcomingAppointments()]
            .sort(dateAscending)
            .reduce((appointmentGroups, appointment) => {
                const format = this.isAppointmentFromThisYear(appointment)
                    ? 'MMMM'
                    : 'MMMM, yyyy';
                const groupName = DateUtils.formatDate(
                    appointment.date,
                    format,
                );

                const group: AppointmentGroup = appointmentGroups.find(
                    existingGroup => existingGroup.name === groupName,
                );
                if (!group) {
                    appointmentGroups.push(
                        new AppointmentGroup(groupName, [appointment]),
                    );
                } else {
                    group.appointments.push(appointment);
                }

                return appointmentGroups;
            }, []);
    }

    private getPastAppointmentsGroup(): AppointmentGroup {
        const dateDescending = (a, b) => b.date.getTime() - a.date.getTime();

        return new AppointmentGroup(
            this.localize.fromKey('pastAppointments'),
            [...this.getPastAppointments()].sort(dateDescending),
        );
    }
}
