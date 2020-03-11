import { StepsService } from '@lib/goals/steps.service';
import { Goal } from '@lib/goals/goal.model';
import { GoalProgressComponent } from './goal-progress.component';
import { GoalProgressState } from './goal-progress.state';

export class StepsProgressState implements GoalProgressState {
    stepGoalValue = 0;
    constructor(
        private context: GoalProgressComponent,
        private stepService: StepsService,
    ) {}
    handleGoal(goal: Goal) {
        this.context.failed = false;
        const patientId = this.context.getPatientId();
        if (this.stepService && this.stepService.getStepsByPatientId) {
            this.stepService.getStepsByPatientId(patientId).subscribe(res => {
                this.stepGoalValue = res;
                this.context.centerText = `${this.stepGoalValue}`;
                this.context.currentValue =
                    (this.stepGoalValue / goal.target) * 100;
                this.context.subtext = this.context.localiseService.fromKey(
                    'avgWeeklySteps',
                );
            });
        }
    }
}
