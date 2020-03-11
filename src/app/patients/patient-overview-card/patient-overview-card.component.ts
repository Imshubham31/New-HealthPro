import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { EditPatientComponent } from '../edit-patient/edit-patient.component';
import { PatientOverview } from '../view-patient.model';
import { CareModulesService } from '../add-patient/care-module/caremodules.service';
import { map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { ChangePathwayComponent } from '../change-pathway/change-pathway.component';
import { oc } from 'ts-optchain';

@Component({
    selector: 'patient-overview-card',
    moduleId: module.id,
    templateUrl: './patient-overview-card.component.html',
    styleUrls: ['./patient-overview-card.component.scss'],
})
export class PatientOverviewCardComponent implements OnInit {
    @Input() showEditDetails = false;
    @Input() patientOverviewData: PatientOverview;
    authenticationService = AuthenticationService;

    constructor(
        private modalService: ModalService,
        public careModulesService: CareModulesService,
    ) {}

    ngOnInit() {
        if (this.patientOverviewData.patient.mdts.length > 0) {
            this.patientOverviewData.patient.mdts.sort(
                (a: any, b: any) => a.personal - b.personal,
            );
        }
    }

    canShowEditIcon(): Observable<Boolean> {
        if (
            this.patientOverviewData.careModule &&
            AuthenticationService.isCareCoordinator() &&
            oc(
                this.patientOverviewData.patient,
            ).onboardingState.hasConsented() === true
        ) {
            return this.careModulesService.getCareModuleCount().pipe(
                map(count => {
                    return count > 1;
                }),
            );
        } else {
            return of(false);
        }
    }

    get shouldShowEditProfile() {
        return (
            this.showEditDetails && AuthenticationService.isCareCoordinator()
        );
    }

    editPatient() {
        this.modalService
            .create<EditPatientComponent>(EditPatientComponent, {
                patient: this.patientOverviewData.patient,
            })
            .checkIfIntegrated();
    }

    openEditCareModule() {
        this.modalService
            .create<ChangePathwayComponent>(ChangePathwayComponent)
            .openWithPatient(this.patientOverviewData);
    }
}
