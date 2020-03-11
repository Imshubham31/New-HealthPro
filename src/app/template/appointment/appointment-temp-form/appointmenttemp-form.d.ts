import { EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BaseForm } from '@lib/shared/services/base-form';
import { AppointmentService } from './../../appointment.service';
import { AppointmentTemplate } from './../../appointmenttemplate.model';
import { LocaliseService } from '@lib/localise/localise.service';
import { RestError } from '@lib/shared/services/error.pipe';
import { ToastService } from '@lib/shared/components/toast/toast.service';
import { CareModuleModel } from 'app/patients/add-patient/care-module/care-module.model';
export interface AppoinmtneTempFormState {
    context: AppointmentTempFormContext;
    title: string;
    subTitle: string;
    submitButtonText: string;
    submit(): void;
    setupForm(): void;
}

export interface AppointmentTempFormContext extends BaseForm {
    fb: FormBuilder;
    appointmentService: AppointmentService;
    localiseService: LocaliseService;
    toastService: ToastService;
    appointmentTemplate: AppointmentTemplate;
    careModulesList: CareModuleModel[];
    errors: RestError[];
    onSuccess: EventEmitter<any>;
    finish();
}
