import { Subscription } from 'rxjs';
import { Component, Input, OnInit, Type } from '@angular/core';

import { PatientOverview } from '../../patients/view-patient.model';
import { Pathway } from '@lib/pathway/pathway.model';
import { GoalService } from '@lib/goals/goal.service';
import { ComponentsFactory } from '@lib/shared/services/components.factory';
import { distinctUntilKeyChanged, filter } from 'rxjs/operators';
import { Unsubscribe } from '@lib/utils/unsubscribe';

@Component({
    selector: 'goal-details',
    templateUrl: './goal-details.component.html',
    styleUrls: ['./goal-details.component.scss'],
})
@Unsubscribe()
export class GoalDetailsComponent implements OnInit {
    @Input() patient: PatientOverview;
    @Input() pathway: Pathway;
    subscriptions: Subscription[] = [];
    goalsError: Error;
    goalDetailsComponent: Type<any>;

    constructor(
        public goalService: GoalService,
        private goalDetailsFactory: ComponentsFactory,
    ) {}

    ngOnInit() {
        this.goalService.patient = this.patient;
        this.subscriptions = [
            this.goalService.goal
                .pipe(
                    filter(goal => Boolean(goal.id)),
                    distinctUntilKeyChanged('id'),
                )
                .subscribe(
                    goal => {
                        this.goalsError = null;
                        this.goalDetailsComponent = this.goalDetailsFactory.make(
                            goal.type,
                        );
                    },
                    error => (this.goalsError = error),
                ),
        ];
    }
}
