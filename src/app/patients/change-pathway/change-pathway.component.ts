import { ChangePathwayStage } from './change-pathway-stage';
import { LocaliseService } from './../../../lib/localise/localise.service';
import { PatientOverview } from './../view-patient.model';
import { ChangePathwayCoordinator } from './change-pathway-coordinator';
import { EditCareModuleComponent } from './edit-care-module.component';
import { ModalWrapperComponent } from './../../../lib/shared/components/modal-wrapper/modal-wrapper.component';
import { ModalControls } from './../../../lib/shared/components/modal/modal.service';
import { Component, ViewChild, Type } from '@angular/core';
import { EditSurgeryComponent } from './edit-surgery.component';
import { Unsubscribe } from '@lib/utils/unsubscribe';
import { Subscription } from 'rxjs';
import { oc } from 'ts-optchain';
import { EditMdtComponent } from './edit-mdt.component';

@Component({
    selector: 'change-pathway',
    template: `
        <div
            modal-wrapper
            [contentOverflow]="'visible'"
            [modalTitle]="title"
            [modalSubTitle]="subTitle"
            [showCloseBtn]="false"
            #modal
        >
            <div
                class="toast toast-error"
                *ngIf="(changePathwayCoordinator.state | async).error"
            >
                {{ (changePathwayCoordinator.state | async).error }}
            </div>
            <div
                class="loading"
                *ngIf="
                    (changePathwayCoordinator.state | async).isSubmitting;
                    else showForm
                "
            ></div>
            <ng-template #showForm>
                <ng-template
                    #showForm
                    [ngxComponentOutlet]="component"
                    (ngxComponentOutletActivate)="onActivate($event)"
                ></ng-template>
            </ng-template>
        </div>
    `,
    styleUrls: [`./change-pathway.component.scss`],
})
@Unsubscribe()
export class ChangePathwayComponent implements ModalControls {
    private subscriptions: Subscription[] = [];
    @ViewChild('modal', { static: true })
    modal: ModalWrapperComponent;
    component: Type<ChangePathwayStage>;
    title = '';
    get subTitle() {
        return `${this.localiseService.fromKey('forPatient')} ${oc(
            this.changePathwayCoordinator,
        ).patient.patient.firstName('')} ${oc(
            this.changePathwayCoordinator,
        ).patient.patient.lastName('')}`;
    }

    constructor(
        public changePathwayCoordinator: ChangePathwayCoordinator,
        private localiseService: LocaliseService,
    ) {}

    onActivate(componentInstance: ChangePathwayStage) {
        this.title = componentInstance.title;
    }

    openWithPatient(patient: PatientOverview) {
        this.subscriptions.concat([
            this.changePathwayCoordinator.goToEditCareModule.subscribe(
                () => (this.component = EditCareModuleComponent),
            ),
            this.changePathwayCoordinator.goToEditSurgery.subscribe(
                () => (this.component = EditSurgeryComponent),
            ),
            this.changePathwayCoordinator.goToEditMdt.subscribe(
                () => (this.component = EditMdtComponent),
            ),
            this.changePathwayCoordinator.exit.subscribe(() => {
                this.close();
            }),
        ]);
        this.changePathwayCoordinator.start(patient);
        this.open();
    }

    open() {
        this.modal.openModal();
    }

    close(result?: any) {
        this.modal.closeModal();
    }
}
