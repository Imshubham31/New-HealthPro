import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocaliseModule } from '@lib/localise/localise.module';
import { SharedModule } from '@lib/shared/shared.module';
import { TaskProgressComponent } from '@lib/goals/goal-progress/task-progress.component';
import { ProgressComponent } from '@lib/goals/goal-progress/progress.component';
import { GoalService } from '@lib/goals/goal.service';
import { GoalProgressComponent } from '@lib/goals/goal-progress/goal-progress.component';
import { GoalsRestService } from '@lib/goals/goals-rest.service';
import { StepsService } from '@lib/goals/steps.service';
import { StepRestService } from './step-rest.service';

@NgModule({
    imports: [LocaliseModule, SharedModule, CommonModule, FormsModule],
    exports: [GoalProgressComponent, TaskProgressComponent],
    declarations: [
        GoalProgressComponent,
        TaskProgressComponent,
        ProgressComponent,
    ],
    providers: [GoalService, GoalsRestService, StepsService, StepRestService],
})
export class GoalsModule {}
