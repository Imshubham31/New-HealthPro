import { CareModuleModel } from 'app/patients/add-patient/care-module/care-module.model';
import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { LocaliseService } from '@lib/localise/localise.service';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { BaseForm } from '@lib/shared/services/base-form';
import { ModalControls } from '@lib/shared/components/modal/modal.service';
import { MessageService } from './../../message.service';

import { RestError } from '@lib/shared/services/error.pipe';
import { ToastService } from '@lib/shared/components/toast/toast.service';
import {
    MessageTempFormState,
    MessageTempFormContext,
} from './messagetemp-form.d';
import { MessageTemplate } from './../../messagetemplate.model';

@Component({
    selector: 'app-message-temp-form',
    templateUrl: './message-temp-form.component.html',
    styleUrls: ['./message-temp-form.component.scss'],
})
export class MessageTempFormComponent extends BaseForm
    implements MessageTempFormContext, ModalControls {
    @ViewChild('modal', { static: true }) modal: ModalWrapperComponent;
    messageTemplate: MessageTemplate;
    errors: RestError[] = [];
    state: MessageTempFormState;
    careModulesList: CareModuleModel[];
    @Output() onSuccess = new EventEmitter();
    constructor(
        public fb: FormBuilder,
        public messageService: MessageService,
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
