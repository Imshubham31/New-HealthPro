import { HospitalService } from '@lib/hospitals/hospital.service';
import { PatientsRestService } from './patients-rest.service';
import { Component, OnInit } from '@angular/core';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { AddPatientComponent } from './add-patient/add-patient.component';
import { CareModulesService } from './add-patient/care-module/caremodules.service';
import { Unsubscribe } from '@lib/utils/unsubscribe';

@Component({
    moduleId: module.id,
    selector: 'patients',
    templateUrl: './patients.component.html',
})
@Unsubscribe()
export class PatientsComponent implements OnInit {
    constructor(
        public patientsRestService: PatientsRestService,
        public hospitalService: HospitalService,
        private modalService: ModalService,
        private careModulesService: CareModulesService,
    ) {}

    ngOnInit() {
        this.hospitalService.fetchHospital().subscribe();
        this.careModulesService.fetchCareModules$().subscribe();
    }

    openCreatePatient() {
        this.modalService
            .create<AddPatientComponent>(AddPatientComponent)
            .open();
    }
}
