import { FormBuilder, Validators } from '@angular/forms';
import { BaseForm } from './../../../lib/shared/services/base-form';
import { LocaliseService } from '@lib/localise/localise.service';
import { Component } from '@angular/core';
import { ChangePathwayStage } from './change-pathway-stage';
import { ChangePathwayCoordinator } from './change-pathway-coordinator';
import { MdtsHcps } from '../patient.model';

@Component({
    selector: 'app-name',
    templateUrl: './edit-mdt.component.html',
})
export class EditMdtComponent extends BaseForm implements ChangePathwayStage {
    mdtsHcps: MdtsHcps = null;
    title = '';
    showEditMDTWarning = false;
    constructor(
        private fb: FormBuilder,
        public changePathwayCoordinator: ChangePathwayCoordinator,
        private localise: LocaliseService,
    ) {
        super();
        this.setupModal();
    }

    handleMdtMembersChanged(mdtMembers: MdtsHcps) {
        this.mdtsHcps = mdtMembers;
    }

    setupModal() {
        this.form = this.fb.group({
            mdt: ['', [Validators.required, Validators.minLength(1)]],
        });
        const currentValue = this.changePathwayCoordinator.state.value.mdtHcps;
        if (!currentValue) {
            this.showEditMDTWarning = false;
            this.title = this.localise.fromKey('createMedicalTeam');
        } else {
            this.title = this.localise.fromKey('editMedicalTeam');
            this.showEditMDTWarning = true;
            this.form.get('mdt').setValue(currentValue);
        }
    }

    get submitText() {
        return this.localise.fromKey('updateCareModule');
    }

    previous() {
        this.cleanForm();
        this.changePathwayCoordinator.goBackToEditSurgeon();
    }

    next() {
        if (this.form.valid) {
            this.changePathwayCoordinator.saveMDT(this.mdtsHcps);
        }
    }
}
