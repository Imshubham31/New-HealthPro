import * as round from 'lodash/round';

import { AuthenticationService } from '@lib/authentication/authentication.service';
import { GoalProgressComponent } from './goal-progress.component';
import { GoalProgressState } from './goal-progress.state';
import { Goal } from '@lib/goals/goal.model';

export class WeightProgressState implements GoalProgressState {
    constructor(private context: GoalProgressComponent) {}

    handleGoal(goal: Goal) {
        if (goal.latestRecordValue === undefined) {
            this.context.failed = true;
            return;
        }

        this.context.failed = false;
        const weightDiff = goal.initial - goal.latestRecordValue;
        this.context.centerText = this.context.unitUtils.convertWeight(
            Math.abs(weightDiff),
        );
        this.context.currentValue =
            (weightDiff / (goal.initial - goal.target)) * 100;
        this.context.subtext = this.weightLostOrGained(weightDiff);
    }

    private weightLostOrGained(weightDiff: number) {
        if (round(weightDiff, 2) === 0) {
            return this.context.localiseService.fromKey('noWeightDifference');
        }

        const units = AuthenticationService.getUser().units;
        const differenceText =
            weightDiff < 0
                ? this.context.localiseService.fromKey('gained')
                : this.context.localiseService.fromKey('lost');
        if (units === 'imperial') {
            return `${this.context.localiseService.fromKey(
                'pounds',
            )} ${differenceText}`;
        }

        return `${this.context.localiseService.fromKey(
            'kilogrammes',
        )} ${differenceText}`;
    }
}
