import { ChangePathwayStage } from './change-pathway-stage';
import { Component } from '@angular/core';
import { LocaliseService } from '@lib/localise/localise.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChangePathwayCoordinator } from './change-pathway-coordinator';
import { Subscription } from 'rxjs';
import { SetsUpForm, BaseForm } from '@lib/shared/services/base-form';
import { SurgeonsService } from '../add-patient/surgery-details/surgeons.service';
import { Surgery } from '../surgery.model';
import { Unsubscribe } from '@lib/utils/unsubscribe';

@Component({
    selector: 'edit-surgery',
    templateUrl: './edit-surgery.component.html',
})
@Unsubscribe()
export class EditSurgeryComponent extends BaseForm
    implements ChangePathwayStage, SetsUpForm {
    form: FormGroup;
    subscriptions: Subscription[] = [];

    get title() {
        return this.localise.fromKey('surgeryInformation');
    }

    get submitText() {
        return this.localise.fromKey('nextUpdateMDT');
    }

    constructor(
        private localise: LocaliseService,
        private fb: FormBuilder,
        public changePathwayCoordinator: ChangePathwayCoordinator,
        public surgeonsService: SurgeonsService,
    ) {
        super();
        this.setupForm();
    }

    setupForm() {
        const surgery: Surgery = this.changePathwayCoordinator.state.value
            .surgery;
        this.form = this.fb.group({
            surgery: [surgery ? surgery : null],
        });
    }

    submit() {
        const surgery = new Surgery(
            this.form.value.surgery.surgeon,
            this.form.value.surgery.startDateTime,
        );
        this.changePathwayCoordinator.saveSurgery(surgery);
    }

    shouldDisableSubmit() {
        return this.surgeonsService.store$.value.isFetching || !this.form.valid;
    }
}
