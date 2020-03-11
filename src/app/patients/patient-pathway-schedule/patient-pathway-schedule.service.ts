import { combineLatest as observableCombineLatest, Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { PatientsRestService } from '../patients-rest.service';
import { Pathway } from '@lib/pathway/pathway.model';
import { Patient } from '../patient.model';
import { Goal, GoalType } from '@lib/goals/goal.model';
import { PathwayRestService } from '@lib/pathway/pathway-rest.service';

export interface PathwaySchedule {
    subphases: PathwayScheduleItem[];
}
export interface PathwayScheduleItem {
    phaseId: string;
    startDate: Date;
    subphaseId: string;
    target: number;
    title: string;
    goalId: string;
    type: GoalType;
}

@Injectable()
export class PatientPathwayScheduleService {
    constructor(
        private patientsService: PatientsRestService,
        private pathwayRestService: PathwayRestService,
    ) {}

    savePathwaySchedule(patient: Patient, items: PathwayScheduleItem[]) {
        const payload: PathwaySchedule = {
            subphases: items,
        };
        // TODO: Have this update the store and make a network call
        return this.pathwayRestService.patch(patient.pathwayId, payload, {
            subPath: '/goals',
        });
    }

    getPathwayGoalDates(patient: Patient): Observable<Pathway> {
        return observableCombineLatest(
            this.patientsService.getGoals(patient.backendId),
            this.pathwayRestService.findOne<Pathway>(patient.pathwayId),
        ).pipe(
            map(([goals, pathway]) => {
                return this.assignTargetWeightsToSubphases(goals, pathway.data);
            }),
        );
    }

    getGoals(patient: Patient) {
        return this.patientsService.getGoals(patient.backendId);
    }

    private assignTargetWeightsToSubphases(goals: Goal[], pathway: Pathway) {
        pathway.phases.forEach(phase => {
            phase.subphases.map(subphase => {
                const subphaseGoal = goals.find(
                    goal => goal.subphaseId === subphase.id,
                );
                subphase.target = subphaseGoal ? subphaseGoal.target : null;
                subphase.goalId = subphaseGoal ? subphaseGoal.id : null;
                subphase.phaseId = phase.id;
                return subphase;
            });
        });
        return pathway;
    }
}
