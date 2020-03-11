import { Component, Input } from '@angular/core';
import { AppointmentStatus } from '@lib/appointments/appointment-status.enum';

@Component({
    selector: 'appointment-status',
    template: `
        <i class="fa fa-lg {{ getStatusIcon() }} {{ getStatusColor() }}"></i>
        <span>{{ text }}</span>
    `,
    styleUrls: ['./appointment-status.component.scss'],
})
export class AppointmentStatusComponent {
    @Input() status: AppointmentStatus;
    @Input() text: string;

    getStatusIcon() {
        const map = {
            [AppointmentStatus.pending]: 'fa-clock-o',
            [AppointmentStatus.accepted]: 'fa-check-circle',
            [AppointmentStatus.declined]: 'fa-times',
            [AppointmentStatus.scheduled]: 'fa-check-circle',
            [AppointmentStatus.updated]: 'fa-check-circle',
            [AppointmentStatus.attended]: 'fa-check-circle',
            [AppointmentStatus.missed]: 'fa-times-circle',
        };

        return map[this.status];
    }

    getStatusColor() {
        return AppointmentStatus[this.status];
    }
}
