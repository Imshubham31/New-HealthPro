import { ToastService } from './../../../lib/shared/components/toast/toast.service';
import { CareModuleModel } from './../add-patient/care-module/care-module.model';
import { PatientService } from './../patient.service';
import { LocaliseService } from '@lib/localise/localise.service';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { BehaviorSubject } from 'rxjs';
import { PatientOverview } from 'app/patients/view-patient.model';
import { Injectable, EventEmitter } from '@angular/core';
import { Surgery } from '../surgery.model';
import * as cloneDeep from 'lodash/cloneDeep';
import { PasswordRequiredDialogComponent } from 'app/settings/password-required-dialog/password-required-dialog.component';
import { MdtsHcps } from '../patient.model';

export interface ChangePathwayState {
    nextCareModule: CareModuleModel;
    previousCareModule: CareModuleModel;
    mdtHcps: MdtsHcps;
    surgery: Surgery;
    isSubmitting: boolean;
    error?: string;
}

@Injectable()
export class ChangePathwayCoordinator {
    get patient() {
        return this._patient;
    }
    private _patient: PatientOverview;

    state: BehaviorSubject<ChangePathwayState> = new BehaviorSubject({
        nextCareModule: null,
        previousCareModule: null,
        mdtHcps: null,
        surgery: null,
        isSubmitting: false,
    });

    goToEditCareModule = new EventEmitter();
    goToEditSurgery = new EventEmitter();
    goToEditMdt = new EventEmitter();
    exit = new EventEmitter();

    constructor(
        private modalService: ModalService,
        private localise: LocaliseService,
        private patientService: PatientService,
        private toastService: ToastService,
    ) {}

    start(patient: PatientOverview) {
        this._patient = patient;
        this.state.next({
            isSubmitting: false,
            nextCareModule: null,
            previousCareModule: patient.careModule,
            mdtHcps: MdtsHcps.fromMDts(patient.patient.mdts),
            surgery: cloneDeep(patient.patient.surgery),
        });
        this.goToEditCareModule.emit();
    }

    saveCareModule(careModule: CareModuleModel) {
        this.state.next({
            ...this.state.value,
            nextCareModule: careModule,
        });
        this.goToEditSurgery.emit();
    }

    saveSurgery(surgery: Surgery) {
        this.state.next({ ...this.state.value, surgery });
        this.goToEditMdt.emit();
    }

    saveMDT(mdtHcps: MdtsHcps) {
        this.state.next({ ...this.state.value, mdtHcps });
        this.confirmChanges();
    }

    confirmChanges() {
        const comp = this.modalService.create<PasswordRequiredDialogComponent>(
            PasswordRequiredDialogComponent,
        );
        comp.title = this.localise.fromParams(
            'changePathwayConfirmationTitle',
            [
                this.state.value.previousCareModule.title,
                this.state.value.nextCareModule.title,
            ],
        );
        comp.subtitle = this.localise.fromKey(
            'changePathwayConfirmationSubTitle',
        );
        comp.onSuccess.subscribe(() => {
            this.state.next({ ...this.state.value, isSubmitting: true });
            this.patientService
                .changePathway(this.patient.patient.backendId, this.state.value)
                .subscribe(
                    () => {
                        this.exit.next();
                        this.toastService.show(
                            null,
                            this.localise.fromParams(
                                'changePathwaySuccessMessage',
                                [
                                    this.state.value.previousCareModule.title,
                                    this.state.value.nextCareModule.title,
                                    this.patient.patient.fullName,
                                ],
                            ),
                        );
                    },
                    () => {
                        this.state.next({
                            ...this.state.value,
                            isSubmitting: false,
                            error: this.localise.fromKey('unknownError'),
                        });
                    },
                );
        });
        comp.open();
    }

    goBackToCareModule() {
        this.goToEditCareModule.emit();
    }

    goBackToEditSurgeon() {
        this.goToEditSurgery.emit();
    }
}
