import { ChangePathwayStage } from './change-pathway-stage';
import { LocaliseService } from '../../../lib/localise/localise.service';
import { SetsUpForm } from '../../../lib/shared/services/base-form';
import { BaseForm } from '@lib/shared/services/base-form';
import { ChangePathwayCoordinator } from './change-pathway-coordinator';
import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { oc } from 'ts-optchain';

@Component({
    selector: 'edit-care-module',
    templateUrl: './edit-care-module.component.html',
})
export class EditCareModuleComponent extends BaseForm
    implements SetsUpForm, ChangePathwayStage {
    get title() {
        return this.localise.fromKey('editCareModule');
    }

    get submitText() {
        return this.localise.fromKey('nextSurgeryProcedureInformation');
    }

    constructor(
        private fb: FormBuilder,
        private localise: LocaliseService,
        public changePathwayCoordinator: ChangePathwayCoordinator,
    ) {
        super();
        this.setupForm();
    }

    setupForm() {
        this.form = this.fb.group({
            modules: [
                oc(this.changePathwayCoordinator).state.value.nextCareModule.id(
                    null,
                ),
                [Validators.required],
            ],
        });
    }

    submit() {
        super.submit();
        this.changePathwayCoordinator.saveCareModule(this.form.value.modules);
    }
}
