import { Component } from '@angular/core';

import { PatientCardComponent } from './patient-card.component';
import { GoalService } from '@lib/goals/goal.service';

@Component({
    selector: 'patient-card-row',
    templateUrl: './patient-card.component.html',
    styleUrls: ['./patient-card.component.scss'],
    providers: [GoalService],
})
export class PatientCardRowComponent extends PatientCardComponent {}
