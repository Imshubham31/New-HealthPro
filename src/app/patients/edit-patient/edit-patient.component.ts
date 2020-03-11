import {
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { LocaliseService } from '@lib/localise/localise.service';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { ModalControls } from '@lib/shared/components/modal/modal.service';
import { BaseForm } from '@lib/shared/services/base-form';
import { SurgeonsService } from '../add-patient/surgery-details/surgeons.service';
import { Patient } from '../patient.model';
import { PatientService } from '../patient.service';
import { ToastService } from '@lib/shared/components/toast/toast.service';
import { HospitalService } from '@lib/hospitals/hospital.service';
import { EditPatientFormGroup } from './edit-patient.form-group';

@Component({
    templateUrl: 'edit-patient.component.html',
})
export class EditPatientComponent extends BaseForm
    implements OnChanges, ModalControls {
    @Input() patient: Patient;
    integrated = false;
    currentDate = new Date();
    @ViewChild('modal', { static: true }) modal: ModalWrapperComponent;
    errors: string[] = [];

    constructor(
        private patientService: PatientService,
        private localiseService: LocaliseService,
        private toastService: ToastService,
        private hospitalService: HospitalService,
        public surgeonService: SurgeonsService,
    ) {
        super();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.form.reset(this.patient);
    }

    checkIfIntegrated() {
        this.hospitalService.fetchHospital().subscribe(hospital => {
            this.integrated = hospital.integrated;
            this.open();
        });
    }

    open() {
        this.form = new EditPatientFormGroup(this.integrated, this.patient);
        this.submitting = false;
        this.errors = [];
        this.form.reset(this.patient);
        this.modal.openModal();
    }

    close() {
        this.modal.closeModal();
    }
    submit() {
        this.errors = [];
        this.submitting = true;
        this.patientService.update(this.form.value).subscribe(
            () => {
                this.toastService.show(
                    null,
                    this.localiseService.fromKey('editPatientSuccess'),
                );
                this.modal.closeModal();
            },
            () => {
                this.errors = [
                    this.localiseService.fromKey('editPatientError'),
                ];
                this.submitting = false;
            },
        );
    }
}
