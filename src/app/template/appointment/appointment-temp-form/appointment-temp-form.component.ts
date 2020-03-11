import { CareModuleModel } from 'app/patients/add-patient/care-module/care-module.model';
import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { LocaliseService } from '@lib/localise/localise.service';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { BaseForm } from '@lib/shared/services/base-form';
import { ModalControls } from '@lib/shared/components/modal/modal.service';
import { RestError } from '@lib/shared/services/error.pipe';
import { ToastService } from '@lib/shared/components/toast/toast.service';
import { AppointmentService } from './../../appointment.service';
import {
    AppoinmtneTempFormState,
    AppointmentTempFormContext,
} from './appointmenttemp-form.d';
import { AppointmentTemplate } from './../../appointmenttemplate.model';
@Component({
    selector: 'app-appointment-temp-form',
    templateUrl: './appointment-temp-form.component.html',
    styleUrls: ['./appointment-temp-form.component.scss'],
})
export class AppointmentTempFormComponent extends BaseForm
    implements AppointmentTempFormContext, ModalControls {
    @ViewChild('modal', { static: true }) modal: ModalWrapperComponent;
    appointmentTemplate: AppointmentTemplate;
    errors: RestError[] = [];
    state: AppoinmtneTempFormState;
    careModulesList: CareModuleModel[];
    @Output() onSuccess = new EventEmitter();
    constructor(
        public fb: FormBuilder,
        public appointmentService: AppointmentService,
        public localiseService: LocaliseService,
        public toastService: ToastService,
    ) {
        super();
    }

    open() {
        this.state.context = this;
        this.state.setupForm();
        this.modal.openModal();
    }

    close() {
        this.modal.closeModal();
        this.cleanForm();
    }

    cleanForm() {
        super.cleanForm();
        this.errors = [];
    }

    finish() {
        this.close();
    }

    shouldDisableSubmit() {
        return super.shouldDisableSubmit();
    }
}
