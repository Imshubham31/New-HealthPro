import { NgModule } from '@angular/core';
import { AppointmentResponseComponent } from '@lib/appointments/appointment-response/appointment-response.component';
import { AppointmentStatusComponent } from '@lib/appointments/appointment-status/appointment-status.component';
import { SharedModule } from '../shared/shared.module';
import { LocaliseModule } from '@lib/localise/localise.module';
import { CommonModule } from '@angular/common';
import { PatientsRestService } from 'app/patients/patients-rest.service';
import { NgxdModule } from '@ngxd/core';
import { AppointmentDetailsWrapperComponent } from './appointment-details/appointment-details-wrapper.component';
import { AppointmentDetailsComponent } from './appointment-details/appointment-details.component';
// tslint:disable:max-line-length
import { NonIntegratedAppointmentDetailsComponent } from './appointment-details/non-integrated/non-integrated-appointment-details.component';
import { IntegratedAppointmentDetailsComponent } from './appointment-details/integrated/integrated-appointment-details.component';
import { IntegratedAppointmentDetailsActionsComponent } from './appointment-details/integrated/integrated-appointment-details-actions.component';
import { NonIntegratedAppointmentDetailsActionsComponent } from './appointment-details/non-integrated/non-integrated-appointment-details-actions.component';

@NgModule({
    imports: [SharedModule, LocaliseModule, CommonModule, NgxdModule],
    providers: [PatientsRestService],
    declarations: [
        AppointmentResponseComponent,
        AppointmentStatusComponent,
        AppointmentDetailsComponent,
        NonIntegratedAppointmentDetailsComponent,
        IntegratedAppointmentDetailsComponent,
        IntegratedAppointmentDetailsActionsComponent,
        NonIntegratedAppointmentDetailsActionsComponent,
        AppointmentDetailsWrapperComponent,
    ],
    exports: [
        AppointmentDetailsComponent,
        AppointmentStatusComponent,
        NonIntegratedAppointmentDetailsComponent,
        IntegratedAppointmentDetailsComponent,
        IntegratedAppointmentDetailsActionsComponent,
        NonIntegratedAppointmentDetailsActionsComponent,
        AppointmentDetailsWrapperComponent,
    ],
    entryComponents: [
        NonIntegratedAppointmentDetailsComponent,
        IntegratedAppointmentDetailsComponent,
        IntegratedAppointmentDetailsActionsComponent,
        NonIntegratedAppointmentDetailsActionsComponent,
    ],
})
export class AppointmentsModule {}
