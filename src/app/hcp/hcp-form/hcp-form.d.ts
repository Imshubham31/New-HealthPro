import { FormGroup, FormBuilder } from '@angular/forms';
import { Hcp } from '../hcp.model';
import { BaseForm } from '@lib/shared/services/base-form';
import { HcpService } from '../hcp.service';
import { LocaliseService } from '@lib/localise/localise.service';
import { RestError } from '@lib/shared/services/error.pipe';
import { ToastService } from '@lib/shared/components/toast/toast.service';

export interface HcpFormState {
    context: HcpFormContext;
    title: string;
    submitButtonText: string;
    submit(): void;
    setupForm(): void;
}

export interface HcpFormContext extends BaseForm {
    fb: FormBuilder;
    hcpService: HcpService;
    localiseService: LocaliseService;
    toastService: ToastService;
    hcp: Hcp;
    userRoles: string[];
    otherValue: string;
    errors: RestError[];
    finish();
    existingValues: string;
    roleRadioControl: string;
}
