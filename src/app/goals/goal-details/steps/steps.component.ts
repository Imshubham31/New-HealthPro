import { map } from 'rxjs/operators';
import { Component } from '@angular/core';
import { LocaliseService } from '@lib/localise/localise.service';
import { PatientsRestService } from '../../../patients/patients-rest.service';
import { InputType } from '@lib/shared/components/input-with-pencil/input-with-pencil.component';
import { UnitsUtils } from '@lib/utils/units-utils';
import { GoalType } from '@lib/goals/goal.model';
import { GoalDetails } from '../goal-details';
import { GoalService } from '@lib/goals/goal.service';
import { StepsService } from '@lib/goals/steps.service';
import { endOfISOWeek, startOfISOWeek } from 'date-fns';
import { DateUtils } from '@lib/utils/date-utils';

@Component({
    selector: 'app-steps-count-goal',
    templateUrl: './steps.component.html',
    styleUrls: ['../goal-details.component.scss', './steps.component.scss'],
})
export class StepCountGoalDetailsComponent extends GoalDetails {
    getStepDetails: any;
    type = GoalType.stepCount;
    patientFirstName = this.goalService.patient.patient.firstName;
    pencilDisabled = true;

    constructor(
        public unitUtils: UnitsUtils,
        public goalService: GoalService,
        public patientsRestService: PatientsRestService,
        public localise: LocaliseService,
        public stepsService: StepsService,
    ) {
        super(
            unitUtils,
            goalService,
            patientsRestService,
            localise,
            stepsService,
        );
    }
    get stepType() {
        return InputType.Steps;
    }
    get data() {
        this.getStepDetails = this.goalService.goal.pipe(
            map(goal => this.stepsService.weeklyStepsData(goal)),
        );
        return this.getStepDetails;
    }
    get date() {
        const startOfWeek = DateUtils.formatDate(
            startOfISOWeek(new Date()),
            'd MMM',
        );

        const endOfWeek = DateUtils.formatDate(
            endOfISOWeek(new Date()),
            'd MMM yyyy',
        );

        return `${startOfWeek} - ${endOfWeek}`;
    }
    onNextPrePencil(data) {
        this.pencilDisabled = data;
    }
}
