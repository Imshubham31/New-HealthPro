import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentsComponent } from './appointments.component';
import { WeeklyCalendarComponent } from './calendar/week-calendar.component';
// TODO: should go to the shared module
import { LocaliseModule } from '@lib/localise/localise.module';
import { AppointmentsService } from './appointments.service';

import { AppointmentsRestService } from '@lib/appointments/appointments-rest.service';

import { AppointmentFormComponent } from './appointment-form/appointment-form.component';
import { AppointmentDetailsPageComponent } from './appointment-details-page/appointment-details-page.component';
import { SharedModule } from '@lib/shared/shared.module';
import { AppointmentsModule } from '@lib/appointments/appointments.module';
import { PatientAppointmentsComponent } from './patient-appointments/patient-appointments.component';
// tslint:disable:max-line-length
import { PatientAppointmentsListComponent } from './patient-appointments/patient-appointments-list/patient-appointments-list.component';
import { PatientAppointmentsListItemComponent } from './patient-appointments/patient-appointments-list-item/patient-appointments-list-item.component';
import { AppointmentFormFactory } from './appointment-form/factories/appointment-form.factory';

@NgModule({
    imports: [
        CommonModule,
        AppointmentsRoutingModule,
        SharedModule,
        LocaliseModule,
        AppointmentsModule,
    ],
    declarations: [
        AppointmentsComponent,
        WeeklyCalendarComponent,
        PatientAppointmentsComponent,
        PatientAppointmentsListItemComponent,
        PatientAppointmentsListComponent,
        AppointmentDetailsPageComponent,
        AppointmentFormComponent,
    ],
    providers: [
        AppointmentsService,
        AppointmentsRestService,
        AppointmentFormFactory,
    ],
    entryComponents: [AppointmentFormComponent],
})
export class HcpAppointmentsModule {}
