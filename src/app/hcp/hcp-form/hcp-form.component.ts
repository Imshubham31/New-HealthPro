import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { LocaliseService } from '@lib/localise/localise.service';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { BaseForm } from '@lib/shared/services/base-form';
import { Masks } from '@lib/utils/masks';
import { Hcp } from '../hcp.model';
import { HcpService } from '../hcp.service';
import { HcpFormContext, HcpFormState } from './hcp-form.d';
import { ModalControls } from '@lib/shared/components/modal/modal.service';
import { RestError } from '@lib/shared/services/error.pipe';
import { ToastService } from '@lib/shared/components/toast/toast.service';

@Component({
    templateUrl: './hcp-form.component.html',
    styleUrls: ['./hcp-form.component.scss'],
})
export class HcpFormComponent extends BaseForm
    implements HcpFormContext, ModalControls {
    @ViewChild('modal', { static: true }) modal: ModalWrapperComponent;
    @ViewChild('phoneField', { static: false }) phoneField: any;
    hcp = new Hcp();
    userRoles: string[] = ['surgeon'];
    errors: RestError[] = [];
    state: HcpFormState;
    existingValues = 'existingValues';
    otherValue = 'other';
    roleRadioControl = 'roleRadioControl';

    constructor(
        public fb: FormBuilder,
        public hcpService: HcpService,
        public localiseService: LocaliseService,
        public toastService: ToastService,
    ) {
        super();
    }

    open() {
        this.state.context = this;
        this.state.setupForm();
        this.modal.openModal();
        setTimeout(() => Masks.phone(this.phoneField.nativeElement));
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
        return super.shouldDisableSubmit() || !this.hasRole();
    }

    shouldDisableOther() {
        return (
            this.form.get(this.roleRadioControl).value === this.existingValues
        );
    }

    hasRole() {
        const formModel = this.form.value;
        if (formModel[this.roleRadioControl] === this.existingValues) {
            return !!formModel.existingRole;
        }

        return !!formModel.otherRole;
    }
}
