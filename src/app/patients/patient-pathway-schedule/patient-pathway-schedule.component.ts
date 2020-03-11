import { PatientService } from './../patient.service';
import { finalize, tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Pathway, SubPhase } from '@lib/pathway/pathway.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient } from '../patient.model';
import { Subscription, combineLatest } from 'rxjs';
import { Unsubscribe } from '@lib/utils/unsubscribe';
import {
    PatientPathwayScheduleService,
    PathwayScheduleItem,
} from './patient-pathway-schedule.service';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { BaseForm } from '@lib/shared/services/base-form';
import { LocaliseService } from '@lib/localise/localise.service';
import { UnitsUtils } from '@lib/utils/units-utils';
import { DateUtils } from '../date-utils';
import { WeightComponent } from './weight/weight-goal.component';
import { StepsComponent } from './step/step-goal.component';
import { GoalType } from '@lib/goals/goal.model';
import { PathwayUtils } from '@lib/pathway/pathway-utils';
import * as find from 'lodash/find';

@Component({
    selector: 'patient-pathway-schedule',
    templateUrl: './patient-pathway-schedule.component.html',
    styleUrls: ['./patient-pathway-schedule.component.scss'],
})
@Unsubscribe()
export class PatientPathwayScheduleComponent extends BaseForm
    implements OnInit {
    patient: Patient;
    pathway: Pathway;
    subscriptions: Subscription[] = [];
    goalInput;
    type: GoalType;
    loading = false;

    constructor(
        public unitUtils: UnitsUtils,
        private route: ActivatedRoute,
        private router: Router,
        private patientPathwayScheduleService: PatientPathwayScheduleService,
        private formBuilder: FormBuilder,
        private localise: LocaliseService,
        private patientService: PatientService,
    ) {
        super();
    }

    ngOnInit() {
        this.loading = true;
        this.form = this.formBuilder.group({
            items: this.formBuilder.array([]),
        });
        this.patientService.fetchPatientWithId(
            this.route.snapshot.params['id'],
        );
        this.patientService
            .getPatient$(this.route.snapshot.params['id'])
            .subscribe(data => {
                this.patient = data.patient;
                this.subscriptions.push(
                    combineLatest(
                        this.patientPathwayScheduleService.getPathwayGoalDates(
                            this.patient,
                        ),
                        this.patientPathwayScheduleService.getGoals(
                            this.patient,
                        ),
                    )
                        .pipe(tap(() => (this.loading = false)))
                        .subscribe(([pathway, goals]) => {
                            this.pathway = pathway;
                            this.createFormArray();
                            (this.form.get(
                                'items',
                            ) as FormArray).controls.forEach(item => {
                                item.get('subphaseId').valueChanges.subscribe(
                                    subphaseId => {
                                        this.findPreviousSubphase(subphaseId)
                                            ? item.get('startDate').disable()
                                            : item.get('startDate').enable();
                                    },
                                );
                            });
                            if (
                                goals.find(
                                    goal => goal.type === GoalType.stepCount,
                                )
                            ) {
                                this.goalInput = StepsComponent;
                                this.type = GoalType.stepCount;
                            } else {
                                this.goalInput = WeightComponent;
                                this.type = GoalType.weight;
                            }
                            this.disablePreviousSubphases(this.pathway);
                        }),
                );
            });
    }

    get items(): FormArray {
        return this.form.get('items') as FormArray;
    }

    findPreviousSubphase(subphaseId: string) {
        const previousSubphases = PathwayUtils.getPreviousSubphases(
            this.pathway,
        );

        return find(previousSubphases, ['id', subphaseId]);
    }

    private createFormArray() {
        if (!this.pathway) {
            return;
        }
        this.pathway.phases.forEach(phase => {
            phase.subphases.forEach(subphase => {
                this.addItem(subphase);
            });
        });
    }

    private addItem(subphase: SubPhase): void {
        const item = this.formBuilder.group({
            title: subphase.title,
            startDate: [
                {
                    value: subphase.startDate
                        ? new Date(subphase.startDate)
                        : '',
                    disabled: false,
                },
                [Validators.required],
            ],
            target: subphase.target,
            subphaseId: subphase.id,
            goalId: subphase.goalId,
            phaseId: subphase.phaseId,
        });
        this.items.push(item);
    }

    phaseBelongsToSubphase(phaseId: string, subphaseId: string) {
        return this.pathway.phases
            .find(next => next.id === phaseId)
            .subphases.find(subphase => subphase.id === subphaseId);
    }

    getMinDate(index: number) {
        const date = this.items.controls
            .slice(0, index)
            .reverse()
            .find(control => control.value.startDate !== '');
        return date ? date.value.startDate : null;
    }

    getMaxDate(index: number) {
        const date = this.items.controls
            .slice(index + 1)
            .find(control => control.value.startDate !== '');
        return date ? date.value.startDate : null;
    }

    disablePreviousSubphases(pathway: Pathway) {
        this.items.getRawValue().forEach((item, index) => {
            if (
                PathwayUtils.getPreviousSubphases(pathway).find(
                    x => x.id === item.subphaseId,
                )
            ) {
                this.items.at(index).disable();
            }
        });
    }

    submit() {
        if (!this.form.valid) {
            return;
        }
        this.submitting = true;
        super.submit();
        this.patientPathwayScheduleService
            .savePathwaySchedule(this.patient, this.updatedFieldsArray())
            .pipe(finalize(() => (this.submitting = false)))
            .subscribe(
                () =>
                    this.router.navigate([
                        '/patient/details',
                        { id: this.patient.backendId },
                    ]),
                () =>
                    (this.formError = this.localise.fromKey(
                        'pathwayScheduleFail',
                    )),
            );
    }

    private updatedFieldsArray(): PathwayScheduleItem[] {
        return this.items
            .getRawValue()
            .map((subPhase: PathwayScheduleItem) => ({
                subphaseId: subPhase.subphaseId,
                startDate: subPhase.startDate
                    ? DateUtils.toUTCDate(new Date(subPhase.startDate))
                    : undefined,
                target:
                    this.type === GoalType.weight
                        ? UnitsUtils.formatWeight(subPhase.target)
                        : Number(subPhase.target),
                title: subPhase.title,
                phaseId: subPhase.phaseId,
                goalId: subPhase.goalId,
                type: this.type,
            }));
    }

    shouldDisableSubmit() {
        return super.shouldDisableSubmit() || this.form.pristine;
    }
}
