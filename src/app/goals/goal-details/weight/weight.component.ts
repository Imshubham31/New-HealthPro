import { Component } from '@angular/core';
import { UnitsUtils } from '@lib/utils/units-utils';
import { GoalDetails } from '../goal-details';
import { GoalType } from '@lib/goals/goal.model';
import { AuthenticationService } from './../../../../lib/authentication/authentication.service';
@Component({
    selector: 'app-weight-goals',
    templateUrl: './weight.component.html',
    styleUrls: ['../goal-details.component.scss'],
})
export class WeightGoalDetailsComponent extends GoalDetails {
    type = GoalType.weight;
    lang = AuthenticationService.getUserLanguage();
    updateInitialWeight(stringValue: string) {
        this.goalService
            .updateInitialWeight(
                Number(UnitsUtils.parseNumberString(stringValue)),
            )
            .subscribe();
    }

    updateWeightTarget(stringValue: string) {
        const covertedWeight = UnitsUtils.formatWeight(
            Number(UnitsUtils.parseNumberString(stringValue)),
        );
        this.goalService.updateGoalTarget(covertedWeight).subscribe();
    }
}
