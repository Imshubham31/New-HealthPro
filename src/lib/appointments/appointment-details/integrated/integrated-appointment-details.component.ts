import { IntegratedAvatarWithLabelComponent } from '@lib/shared/components/avatars/integrated-avatar-with-label.component';
import { Component } from '@angular/core';
import { DetailsComponent } from '../appointment-details';
import { LocalisedDatePipe } from '@lib/shared/services/localise-date.pipe';
import { LocaliseService } from '@lib/localise/localise.service';
import { Appointment } from '../../appointment.model';
import { IntegratedAppointmentDetailsActionsComponent } from './integrated-appointment-details-actions.component';

@Component({
    selector: 'integrated-appointment-details',
    templateUrl: '../appointment-details.component.html',
    styleUrls: ['../appointment-details.component.scss'],
})
export class IntegratedAppointmentDetailsComponent extends DetailsComponent {
    actionsComponent = IntegratedAppointmentDetailsActionsComponent;
    watcherComponent = IntegratedAvatarWithLabelComponent;
    constructor(
        protected datePipe: LocalisedDatePipe,
        protected localise: LocaliseService,
    ) {
        super(datePipe, localise);
    }
    get title() {
        return this.appointment.title || this.localise.fromKey('appointment');
    }

    lastModifiedDate(appointment: Appointment) {
        return '';
    }
    description(appointment: Appointment) {
        return (
            appointment.description ||
            this.localise.fromKey('noFurtherInformation')
        );
    }
}
