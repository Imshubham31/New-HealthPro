import { Input, Output, EventEmitter, Type } from '@angular/core';
import { Appointment } from '../appointment.model';
import { AppointmentStatus } from '../appointment-status.enum';
import { LocalisedDatePipe } from '@lib/shared/services/localise-date.pipe';
import { LocaliseService } from '@lib/localise/localise.service';
import { AvatarWithLabelComponent } from '@lib/shared/components/avatars/avatar-with-label.component';
import { IntegratedAvatarWithLabelComponent } from '@lib/shared/components/avatars/integrated-avatar-with-label.component';
import { IntegratedAppointmentDetailsActionsComponent } from './integrated/integrated-appointment-details-actions.component';
import { NonIntegratedAppointmentDetailsActionsComponent } from './non-integrated/non-integrated-appointment-details-actions.component';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { DateUtils } from '@lib/utils/date-utils';

export abstract class DetailsComponent {
    @Input() appointment: Appointment;

    @Input() canRespond = false; // TODO: Override these
    @Input() canSeePatients = true; // TODO: Why is this here?
    @Output() onDelete = new EventEmitter<void>();
    @Output() onResponse = new EventEmitter<AppointmentStatus>();
    actionsComponent: Type<
        | NonIntegratedAppointmentDetailsActionsComponent
        | IntegratedAppointmentDetailsActionsComponent
    >;
    watcherComponent: Type<
        AvatarWithLabelComponent | IntegratedAvatarWithLabelComponent
    >;
    constructor(
        protected datePipe: LocalisedDatePipe,
        protected localise: LocaliseService,
    ) {}
    lang = AuthenticationService.getUserLanguage();
    get statusText() {
        return AppointmentStatus[this.appointment.status];
    }

    get title() {
        return this.appointment.title;
    }

    startDate(appointment: Appointment) {
        if (!appointment.timeSlot) {
            return '';
        }
        return DateUtils.formatDateUserPreference(appointment.timeSlot.start);
    }

    dayAndTime(appointment: Appointment) {
        if (!appointment.timeSlot) {
            return '';
        }
        if (!appointment.startDateIncludesTime) {
            return DateUtils.formatDate(appointment.timeSlot.start, 'EEEE');
        }

        // tslint:disable-next-line: max-line-length
        return `${DateUtils.formatDate(
            appointment.timeSlot.start,
            'EEEE',
        )}, ${DateUtils.formatDate(appointment.timeSlot.start, 'h:mm a')}`;
    }

    lastModifiedDate(appointment: Appointment) {
        return DateUtils.formatDateUserPreference(
            appointment.lastModifiedDateTime,
        );
    }

    description(appointment: Appointment) {
        return appointment.description;
    }
}
