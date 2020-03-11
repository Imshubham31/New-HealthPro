import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AddPatientCoordinator } from '../add-patient-coordinator.service';
import { BaseForm, SetsUpForm } from '@lib/shared/services/base-form';
import { CareModuleModel } from './care-module.model';
import { CareModulesService } from 'app/patients/add-patient/care-module/caremodules.service';

@Component({
    moduleId: module.id,
    selector: 'care-module',
    styleUrls: ['care-module.component.scss'],
    templateUrl: 'care-module.component.html',
})
export class CareModuleComponent extends BaseForm implements SetsUpForm {
    @Output() onCancel = new EventEmitter();
    careModules: CareModuleModel[];

    constructor(
        private fb: FormBuilder,
        private addPatientCoordinator: AddPatientCoordinator,
        public careModuleService: CareModulesService,
    ) {
        super();
        this.setupForm();
    }

    setupForm(): void {
        this.form = this.fb.group({
            modules: [
                this.addPatientCoordinator.patient.careModuleId,
                [Validators.required],
            ],
        });
        this.form.markAsDirty();
    }

    previous() {
        this.cleanForm();
        this.addPatientCoordinator.clearCareModule();
        this.onCancel.next();
    }

    submit() {
        super.submit();
        this.addPatientCoordinator.saveCareModules(this.form.value.modules);
        this.cleanForm();
    }
}
