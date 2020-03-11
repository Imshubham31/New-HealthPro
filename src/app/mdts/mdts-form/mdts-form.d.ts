import { EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BaseForm } from '@lib/shared/services/base-form';
import { LocaliseService } from '@lib/localise/localise.service';
import { RestError } from '@lib/shared/services/error.pipe';
import { ToastService } from '@lib/shared/components/toast/toast.service';
import { CareModuleModel } from 'app/patients/add-patient/care-module/care-module.model';
import { MDTs } from '../mdts.model';
import { MdtsService } from '../mdts.service';
import { Router } from '@angular/router';
export interface MdtsFormState {
    context: MdtsFormContext;
    title: string;
    submit(): void;
    setupForm(): void;
    id: string;
}

export interface MdtsFormContext extends BaseForm {
    fb: FormBuilder;
    mdtsService: MdtsService;
    localiseService: LocaliseService;
    toastService: ToastService;
    mdts: MDTs;
    id: string;
    errors: RestError[];
    onSuccess: EventEmitter<MDTs>;
    finish();
}
