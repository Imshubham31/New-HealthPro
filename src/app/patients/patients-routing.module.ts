import { AllPatientsOverviewComponent } from './patient-overview/all-patients-overview/all-patients-overview.component';
import { PatientDetailsComponent } from './patient-details/patient-details/patient-details.component';
import { NgModule } from '@angular/core';
import { PatientsComponent } from './patients.component';
import { C4TRouterModule, Routes } from '@lib/router/c4t-router.module';
import { PatientPathwayScheduleComponent } from './patient-pathway-schedule/patient-pathway-schedule.component';

const routes: Routes = [
    { path: 'patients', component: PatientsComponent },
    {
        path: 'patient/details',
        component: PatientDetailsComponent,
    },
    {
        path: 'patient/pathway-dates',
        component: PatientPathwayScheduleComponent,
    },
    { path: 'patients-overview', component: AllPatientsOverviewComponent },
];

@NgModule({
    imports: [C4TRouterModule.addRoutes(routes)],
    exports: [C4TRouterModule],
})
export class PatientsRoutingModule {}
