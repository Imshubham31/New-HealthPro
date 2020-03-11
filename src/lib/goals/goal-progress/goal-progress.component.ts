import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { LocaliseService } from '@lib/localise/localise.service';
import { UnitsUtils } from '@lib/utils/units-utils';
import { Unsubscribe } from '@lib/utils/unsubscribe';
import { GoalType } from '@lib/goals/goal.model';
import { ProgressComponent } from './progress.component';
import { GoalProgressState } from './goal-progress.state';
import { StepsProgressState } from './steps-progress.state';
import { WeightProgressState } from './weight-progress.state';
import { GoalService } from '@lib/goals/goal.service';
import { StepsService } from '@lib/goals/steps.service';

@Component({
    selector: 'goal-progress',
    templateUrl: './progress.component.html',
    styleUrls: ['./progress.component.scss'],
})
@Unsubscribe()
export class GoalProgressComponent extends ProgressComponent implements OnInit {
    subscriptions: Subscription[] = [];
    max = 100;
    state: GoalProgressState;
    constructor(
        private goalService: GoalService,
        public localiseService: LocaliseService,
        public unitUtils: UnitsUtils,
        private stepService: StepsService,
    ) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.goalService.goal
            .pipe(
                map(goal => {
                    switch (goal.type) {
                        case GoalType.weight:
                            this.state = new WeightProgressState(this);
                            return goal;
                        case GoalType.stepCount:
                            this.state = new StepsProgressState(
                                this,
                                this.stepService,
                            );
                            return goal;
                        default:
                            throw new Error('Invalid goal type.');
                    }
                }),
            )
            .subscribe(
                goal => this.state.handleGoal(goal),
                error => (this.failed = true),
            );
    }
    getPatientId() {
        return this.patient.backendId;
    }
    fetchValue() {
        this.subscriptions.push(
            this.goalService
                .fetchPatientGoal(this.patient.backendId, this.pathway)
                .subscribe(null, error => (this.failed = true)),
        );
    }
}
