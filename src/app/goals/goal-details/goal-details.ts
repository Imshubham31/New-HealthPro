import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { LocaliseService } from '@lib/localise/localise.service';
import { PatientsRestService } from '../../patients/patients-rest.service';
import { PatientOverview } from '../../patients/view-patient.model';
import { InputType } from '@lib/shared/components/input-with-pencil/input-with-pencil.component';
import { UnitsUtils } from '@lib/utils/units-utils';
import { GoalService } from '@lib/goals/goal.service';
import { GoalType } from '@lib/goals/goal.model';
import { StepsService } from '@lib/goals/steps.service';

@Injectable()
export abstract class GoalDetails {
    type: GoalType;

    get patient(): PatientOverview {
        return this.goalService.patient;
    }

    get heightType() {
        return InputType.Height;
    }

    constructor(
        public unitUtils: UnitsUtils,
        public goalService: GoalService,
        public patientsRestService: PatientsRestService,
        public localise: LocaliseService,
        public stepsService: StepsService,
    ) {}

    createRecord(stringValue: string) {
        this.goalService
            .createRecord(
                Number(UnitsUtils.parseNumberString(stringValue)),
                this.type,
            )
            .subscribe();
    }

    updateGoalTarget(stringValue: string) {
        const newGoal = Number(UnitsUtils.parseNumberString(stringValue));
        this.goalService.updateGoalTarget(newGoal).subscribe(() => {
            this.stepsService.updateGoal(newGoal);
        });
    }

    updateHeight(patientId: string, value: any) {
        const height = UnitsUtils.formatHeight(`${value}`);
        this.patientsRestService
            .updateHeight(patientId, height)
            .pipe(tap(() => (this.patient.patient.height = height)))
            .subscribe();
    }
}
