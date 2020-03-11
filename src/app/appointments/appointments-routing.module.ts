import { NgModule } from '@angular/core';

import { AppointmentsComponent } from './appointments.component';
import { C4TRouterModule, Routes } from '@lib/router/c4t-router.module';
import { MasterDetailWrapperComponent } from '@lib/shared/components/master-detail/master-detail-wrapper.component';
import { PatientAppointmentsComponent } from './patient-appointments/patient-appointments.component';
import { AppointmentDetailsWrapperComponent } from '@lib/appointments/appointment-details/appointment-details-wrapper.component';
import { AppointmentDetailsPageComponent } from './appointment-details-page/appointment-details-page.component';

const routes: Routes = [
    {
        path: 'appointments',
        children: [
            { path: '', component: AppointmentsComponent },
            { path: ':id', component: AppointmentDetailsPageComponent },
            {
                path: 'user/:id',
                component: MasterDetailWrapperComponent,
                children: [
                    {
                        path: 'all',
                        component: PatientAppointmentsComponent,
                        outlet: 'master',
                    },
                    {
                        path: ':id',
                        component: AppointmentDetailsWrapperComponent,
                        outlet: 'detail',
                    },
                ],
            },
        ],
    },
];

@NgModule({
    imports: [C4TRouterModule.addRoutes(routes)],
    exports: [C4TRouterModule],
})
export class AppointmentsRoutingModule {}
