import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { LocaliseService } from '@lib/localise/localise.service';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { BaseForm } from '@lib/shared/services/base-form';
import { ModalControls } from '@lib/shared/components/modal/modal.service';

import { RestError } from '@lib/shared/services/error.pipe';
import { ToastService } from '@lib/shared/components/toast/toast.service';
import { MdtsFormState } from './mdts-form';
import { MDTs } from '../mdts.model';
import { HcpService } from 'app/hcp/hcp.service';
import { RestrictProcessingPipe } from '@lib/shared/services/restricted-user.pipe';
import { Hcp } from 'app/hcp/hcp.model';
import { MdtsService } from '../mdts.service';

@Component({
    selector: 'app-mdts-form',
    templateUrl: './mdts-form.component.html',
    styleUrls: ['./mdts-form.component.scss'],
})
export class MdtsFormComponent extends BaseForm implements ModalControls {
    @ViewChild('modal', { static: true }) modal: ModalWrapperComponent;
    mdts: MDTs;
    errors: RestError[] = [];
    state: MdtsFormState;
    id: string;
    @Output() onSuccess: EventEmitter<MDTs> = new EventEmitter();
    hcps;
    constructor(
        public fb: FormBuilder,
        public localiseService: LocaliseService,
        public toastService: ToastService,
        public hcpService: HcpService,
        public mdtsService: MdtsService,
    ) {
        super();
        this.getHCPs();
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

    getHCPs() {
        this.hcpService.fetchHcps().subscribe(data => {
            this.hcps = data;
        });
    }

    get hcpLabelFormatter() {
        // We must instantiate the RestrictProcessingPipe like this to avoid scoping issues on modal tag input
        return (hcp: Hcp) =>
            new RestrictProcessingPipe(this.localiseService).transform(hcp);
    }

    get hcpRoleLabel() {
        return (hcp: Hcp) => hcp.role;
    }
}
