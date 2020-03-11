import { EditSurgeryComponent } from './change-pathway/edit-surgery.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd';

import { HcpGoalsModule } from 'app/goals/goals.module';
import { LocaliseModule } from '@lib/localise/localise.module';
import { UnitsUtils } from '@lib/utils/units-utils';
import { MdtModule } from './../mdt/mdt.module';
import { AddPatientCoordinator } from './add-patient/add-patient-coordinator.service';
import { AddPatientComponent } from './add-patient/add-patient.component';
import { CareModuleComponent } from './add-patient/care-module/care-module.component';
import { CareModulesService } from './add-patient/care-module/caremodules.service';
import { SurgeonsService } from './add-patient/surgery-details/surgeons.service';
import { SurgeryDetailsComponent } from './add-patient/surgery-details/surgery-details.component';
import { EditPatientComponent } from './edit-patient/edit-patient.component';
import {
    CurrentPhasePipe,
    CurrentSubPhasePipe,
} from '@lib/pathway/pathway.pipe';
import { PathWayService } from '@lib/pathway/pathway.service';
import { PatientCardRowComponent } from './patient-card/patient-card-row.component';
import { PatientCardComponent } from './patient-card/patient-card.component';
import { PatientConsentComponent } from './patient-consent/patient-consent.component';
import { PatientContactInfoComponent } from './patient-contact-info/patient-contact-info.component';
import { PatientDetailsComponent } from './patient-details/patient-details/patient-details.component';
import { PhaseDetailsComponent } from './patient-details/phase-details/phase-details.component';
import { PhaseMoveConfirmationComponent } from './patient-details/phase-details/phase-move-confirmation.component';
import { ViewHcpsComponent } from './patient-details/view-hcps/view-hcps.component';
import { PatientMdtTeamComponent } from './patient-mdt-team/patient-mdt-team.component';
import { PatientOverviewCardComponent } from './patient-overview-card/patient-overview-card.component';
import { AllPatientsOverviewComponent } from './patient-overview/all-patients-overview/all-patients-overview.component';
import { PatientPathwayScheduleComponent } from './patient-pathway-schedule/patient-pathway-schedule.component';
import { PatientPathwayScheduleService } from './patient-pathway-schedule/patient-pathway-schedule.service';
import { StepsComponent } from './patient-pathway-schedule/step/step-goal.component';
import { WeightComponent } from './patient-pathway-schedule/weight/weight-goal.component';
import { PatientRegistrationComponent } from './patient-registration/patient-registration.component';
import { PatientService } from './patient.service';
import { PatientsRestService } from './patients-rest.service';
import { PatientsRoutingModule } from './patients-routing.module';
import { PatientsComponent } from './patients.component';
import { TaskListComponent } from './task-list/task-list.component';
import { ViewPatientsComponent } from './view-patients/view-patients.component';
import { HcpNotesModule } from '../hcp-notes/hcp-notes.module';
import { SharedModule } from '@lib/shared/shared.module';
import { GoalsModule } from '@lib/goals/goals.module';
import { PathwayRestService } from '../../lib/pathway/pathway-rest.service';
import { IntegratedPersonalDetailsComponent } from 'app/patients/add-patient/personal-details/integrated-personal-details.component';
import { NonIntegratedPersonalDetailsComponent } from 'app/patients/add-patient/personal-details/non-integrated-personal-details.component';
import { ComponentsFactory } from '@lib/shared/services/components.factory';
import { HospitalModule } from '@lib/hospitals/hospital.module';
import { ErrorPipe } from '@lib/shared/services/error.pipe';
import { HospitalType } from '@lib/hospitals/hospital.model';
import { ChangePathwayCoordinator } from './change-pathway/change-pathway-coordinator';
import { ChangePathwayComponent } from './change-pathway/change-pathway.component';
import { NgxdModule } from '@ngxd/core';
import { EditCareModuleComponent } from './change-pathway/edit-care-module.component';
import { EditMdtComponent } from './change-pathway/edit-mdt.component';
import { DeletePatientModalComponent } from './delete-patient-modal/delete-patient-modal.component';
import { PatientRestService } from './patient-rest.service';
import { NzI18nService } from 'ng-zorro-antd/i18n';

@NgModule({
    imports: [
        CommonModule,
        PatientsRoutingModule,
        ReactiveFormsModule,
        LocaliseModule,
        NzDatePickerModule,
        SharedModule,
        MdtModule,
        HcpGoalsModule,
        GoalsModule,
        HcpNotesModule,
        HospitalModule,
        NgxdModule,
    ],
    declarations: [
        PatientsComponent,
        AddPatientComponent,
        EditPatientComponent,
        CareModuleComponent,
        SurgeryDetailsComponent,
        ViewPatientsComponent,
        PatientOverviewCardComponent,
        PatientMdtTeamComponent,
        PatientContactInfoComponent,
        PatientConsentComponent,
        PatientRegistrationComponent,
        PatientCardComponent,
        PatientCardRowComponent,
        CurrentPhasePipe,
        CurrentSubPhasePipe,
        TaskListComponent,
        PatientDetailsComponent,
        ViewHcpsComponent,
        PhaseDetailsComponent,
        AllPatientsOverviewComponent,
        PhaseMoveConfirmationComponent,
        PatientPathwayScheduleComponent,
        StepsComponent,
        WeightComponent,
        IntegratedPersonalDetailsComponent,
        NonIntegratedPersonalDetailsComponent,
        ChangePathwayComponent,
        EditCareModuleComponent,
        EditSurgeryComponent,
        EditMdtComponent,
        DeletePatientModalComponent,
    ],
    providers: [
        AddPatientCoordinator,
        PatientRestService,
        PatientsRestService,
        CareModulesService,
        PatientService,
        SurgeonsService,
        PathwayRestService,
        PathWayService,
        PatientPathwayScheduleService,
        UnitsUtils,
        ComponentsFactory,
        ErrorPipe,
        ChangePathwayCoordinator,
        NzDatePickerModule,
        NzI18nService,
    ],
    exports: [
        PatientOverviewCardComponent,
        PatientRegistrationComponent,
        PatientCardComponent,
        TaskListComponent,
        CurrentPhasePipe,
        CurrentSubPhasePipe,
    ],
    entryComponents: [
        StepsComponent,
        WeightComponent,
        EditPatientComponent,
        AddPatientComponent,
        PhaseMoveConfirmationComponent,
        IntegratedPersonalDetailsComponent,
        NonIntegratedPersonalDetailsComponent,
        ChangePathwayComponent,
        EditCareModuleComponent,
        EditSurgeryComponent,
        EditMdtComponent,
        DeletePatientModalComponent,
    ],
})
export class PatientsModule {
    constructor(addPatientFactory: ComponentsFactory) {
        addPatientFactory.addPart({
            [HospitalType.Integrated]: IntegratedPersonalDetailsComponent,
        });
        addPatientFactory.addPart({
            [HospitalType.NonIntegrated]: NonIntegratedPersonalDetailsComponent,
        });
    }
}
