import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LocaliseModule } from '@lib/localise/localise.module';
import { GoalDetailsComponent } from './goal-details/goal-details.component';
import { StepCountGoalDetailsComponent } from './goal-details/steps/steps.component';
import { WeightGoalDetailsComponent } from './goal-details/weight/weight.component';
import { GoalType } from '@lib/goals/goal.model';
import { SharedModule } from '@lib/shared/shared.module';
import { GoalsModule } from '@lib/goals/goals.module';
import { StepsService } from '@lib/goals/steps.service';
import { ComponentsFactory } from '@lib/shared/services/components.factory';

@NgModule({
    imports: [GoalsModule, LocaliseModule, SharedModule, CommonModule],
    exports: [GoalDetailsComponent],
    declarations: [
        WeightGoalDetailsComponent,
        StepCountGoalDetailsComponent,
        GoalDetailsComponent,
    ],
    providers: [ComponentsFactory, StepsService],
    entryComponents: [
        WeightGoalDetailsComponent,
        StepCountGoalDetailsComponent,
    ],
})
export class HcpGoalsModule {
    constructor(goalDetailsFactory: ComponentsFactory) {
        goalDetailsFactory.addPart({
            [GoalType.weight]: WeightGoalDetailsComponent,
        });
        goalDetailsFactory.addPart({
            [GoalType.stepCount]: StepCountGoalDetailsComponent,
        });
    }
}
