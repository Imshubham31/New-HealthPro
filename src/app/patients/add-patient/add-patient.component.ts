import {
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
    Type,
} from '@angular/core';

import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import {
    AddPatientCoordinator,
    AddPatientStages,
} from './add-patient-coordinator.service';

import { ModalControls } from '@lib/shared/components/modal/modal.service';
import { ComponentsFactory } from '@lib/shared/services/components.factory';
import { HospitalService } from '@lib/hospitals/hospital.service';
import { HospitalType } from '@lib/hospitals/hospital.model';

@Component({
    moduleId: module.id,
    templateUrl: 'add-patient.component.html',
})
export class AddPatientComponent implements OnInit, ModalControls {
    @ViewChild('modal', { static: true }) modal: ModalWrapperComponent;
    addPersonalDetailsComponent: Type<any>;

    get stages() {
        return AddPatientStages;
    }

    constructor(
        public addPatientCoordinator: AddPatientCoordinator,
        private ref: ChangeDetectorRef,
        private addPatientDetailsFactory: ComponentsFactory,
        private hospitalService: HospitalService,
    ) {}

    ngOnInit(): void {
        this.addPatientCoordinator.onComplete$.subscribe(() => this.close());
        this.addPatientCoordinator.onCancel$.subscribe(() => this.close());
        this.hospitalService.hospital.subscribe(hospital => {
            this.addPersonalDetailsComponent = this.addPatientDetailsFactory.make(
                hospital.integrated
                    ? HospitalType.Integrated
                    : HospitalType.NonIntegrated,
            );
        });
    }

    open() {
        this.addPatientCoordinator.reset();
        this.modal.openModal();
    }

    close() {
        this.modal.closeModal();
        this.ref.detectChanges();
    }
}
