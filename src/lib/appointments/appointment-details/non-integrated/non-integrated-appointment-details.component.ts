import { AvatarWithLabelComponent } from '@lib/shared/components/avatars/avatar-with-label.component';
import { Component } from '@angular/core';
import { LocalisedDatePipe } from '@lib/shared/services/localise-date.pipe';
import { LocaliseService } from '@lib/localise/localise.service';
import { DetailsComponent } from '../appointment-details';
import { NonIntegratedAppointmentDetailsActionsComponent } from './non-integrated-appointment-details-actions.component';

@Component({
    selector: 'non-integrated-appointment-details',
    templateUrl: '../appointment-details.component.html',
    styleUrls: ['../appointment-details.component.scss'],
})
export class NonIntegratedAppointmentDetailsComponent extends DetailsComponent {
    actionsComponent = NonIntegratedAppointmentDetailsActionsComponent;
    watcherComponent = AvatarWithLabelComponent;

    constructor(
        protected datePipe: LocalisedDatePipe,
        protected localise: LocaliseService,
    ) {
        super(datePipe, localise);
    }
}
