import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AppCoordinator } from '@lib/app-coordinator/app-coordinator.service';
import { LocaliseService } from '@lib/localise/localise.service';
import { SortParams } from '@lib/shared/services/sort-on.pipe';
import { Unsubscribe } from '@lib/utils/unsubscribe';
import { VirtualScroll } from '@lib/utils/virtual-scroll';
import { AddMdtComponent } from './../../mdt/add-mdt/add-mdt.component';
import { PatientService } from './../patient.service';
import { PatientOverview } from './../view-patient.model';
import { Patient } from './../patient.model';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { oc } from 'ts-optchain';
import { DeletePatientModalComponent } from '../delete-patient-modal/delete-patient-modal.component';

@Component({
    selector: 'view-patients',
    templateUrl: './view-patients.component.html',
    styleUrls: ['./view-patients.component.scss'],
})
@Unsubscribe()
export class ViewPatientsComponent extends VirtualScroll implements OnInit {
    patientOverviews: PatientOverview[];
    subscriptions: Subscription[] = [];
    oc = oc;
    patientConsentField = 'patient.documentsAccepted[2].dateAccepted';
    private patientOverView: PatientOverview;

    constructor(
        public patientService: PatientService,
        public localiseService: LocaliseService,
        private modalService: ModalService,
    ) {
        super();
    }

    sort: SortParams = {
        fields: ['patient.lastName', 'patient.firstName'],
    };

    currentPage: 1;
    get searchFields() {
        return PatientOverview.searchFields;
    }

    get sortLabel() {
        if (oc(this.sort).fields[0]() === 'patient.lastName') {
            return this.localiseService.fromKey('lastName');
        } else if (oc(this.sort).fields[0]() === 'patient.firstName') {
            return this.localiseService.fromKey('firstName');
        }
        return this.localiseService.fromKey('sortBy');
    }

    ngOnInit() {
        AppCoordinator.loadingOverlay.next({
            loading: true,
            message: this.localiseService.fromKey('loadingPatients'),
        });
        this.subscriptions.push(
            this.patientService
                .fetchPatients()
                .subscribe(
                    () =>
                        AppCoordinator.loadingOverlay.next({ loading: false }),
                    () =>
                        AppCoordinator.loadingOverlay.next({ loading: false }),
                ),
        );
    }

    sortOn(field: string, order: string) {
        this.sort = {
            fields: [field],
            order: order,
        };
    }

    openAssignMDT(patientOverview: PatientOverview) {
        this.patientOverView = patientOverview;
        this.modalService
            .create<AddMdtComponent>(AddMdtComponent)
            .startWithPatient(this.patientOverView);
    }

    canDelete(patient: Patient) {
        return oc(patient).onboardingState.hasConsented() !== true;
    }

    showDeletePatient(patient: PatientOverview) {
        this.modalService
            .create<DeletePatientModalComponent>(DeletePatientModalComponent, {
                patient,
            })
            .open();
    }
}
