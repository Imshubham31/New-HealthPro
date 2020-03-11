import { EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BaseForm } from '@lib/shared/services/base-form';
import { MessageService } from './../../message.service';
import { MessageTemplate } from './../../messagetemplate.model';
import { LocaliseService } from '@lib/localise/localise.service';
import { RestError } from '@lib/shared/services/error.pipe';
import { ToastService } from '@lib/shared/components/toast/toast.service';
import { CareModuleModel } from 'app/patients/add-patient/care-module/care-module.model';
export interface MessageTempFormState {
    context: MessageTempFormContext;
    title: string;
    subTitle: string;
    submitButtonText: string;
    submit(): void;
    setupForm(): void;
}

export interface MessageTempFormContext extends BaseForm {
    fb: FormBuilder;
    messageService: MessageService;
    localiseService: LocaliseService;
    toastService: ToastService;
    messageTemplate: MessageTemplate;
    careModulesList: CareModuleModel[];
    errors: RestError[];
    onSuccess: EventEmitter<any>;
    finish();
}
