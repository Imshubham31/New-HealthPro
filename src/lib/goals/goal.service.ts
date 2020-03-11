import { map, finalize, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import * as isFinite from 'lodash/isFinite';
import * as round from 'lodash/round';
import * as find from 'lodash/find';
import { BehaviorSubject, Observable } from 'rxjs';
import { GoalsRestService } from '@lib/goals/goals-rest.service';
import { LocaliseService } from '@lib/localise/localise.service';
import { Pathway } from '@lib/pathway/pathway.model';
import { PatientsRestService } from '../../app/patients/patients-rest.service';
import { PatientOverview } from '../../app/patients/view-patient.model';
import { UnitsUtils } from '@lib/utils/units-utils';
import { Goal, GoalType } from '@lib/goals/goal.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';
import { environment } from '../../environments/environment';

@Injectable()
export class GoalService {
    isFetching = false;
    goal = new BehaviorSubject<Goal>(new Goal());
    patient = new PatientOverview();

    constructor(
        private patientsRestService: PatientsRestService,
        private goalsRestService: GoalsRestService,
        private localise: LocaliseService,
        private http: HttpClient,
    ) {}

    getExcessWeightLoss(height: number) {
        const goal = this.goal.getValue();
        const initialWeight = goal.initial;
        const currentWeight = goal.latestRecordValue;
        const excessWeightLoss =
            ((initialWeight - currentWeight) /
                (initialWeight - (height / 100) ** 2 * 25)) *
            100;

        return isFinite(excessWeightLoss) ? round(excessWeightLoss, 2) : 0;
    }

    getBmi(height: number) {
        const goal = this.goal.getValue();
        const currentWeight = goal.latestRecordValue;
        const bmi = (currentWeight / height ** 2) * 10000;
        return isFinite(bmi) ? round(bmi, 2) : 0;
    }

    getIdealBodyWeight(height: number) {
        const heightPercent = height / 100;
        const idealBodyWeight = heightPercent ** 2 * 25;
        return isFinite(idealBodyWeight) ? round(idealBodyWeight, 2) : 0;
    }

    getAmountTillTarget() {
        const goal = this.goal.getValue();
        const amountTillTarget = goal.latestRecordValue - goal.target;
        return isFinite(amountTillTarget) ? round(amountTillTarget, 2) : 0;
    }

    getAmountLost() {
        const goal = this.goal.getValue();
        const amountLost = goal.initial - goal.latestRecordValue;
        return isFinite(amountLost) ? round(amountLost, 2) : 0;
    }

    fetchPatientGoal(id: string, pathway: Pathway): Observable<Goal> {
        this.isFetching = true;
        return this.patientsRestService.getGoals(id).pipe(
            map(goals => {
                const matchedGoal = find(goals, {
                    pathwayId: pathway.id.toString(),
                    phaseId: pathway.currentPhaseId.toString(),
                    subphaseId: pathway.currentSubphaseId.toString(),
                });
                if (!matchedGoal) {
                    throw new Error(
                        this.localise.fromKey('noCurrentGoalForPatient'),
                    );
                }
                const goal = Goal.map(matchedGoal);
                this.goal.next(goal);
                return goal;
            }),
            finalize(() => (this.isFetching = false)),
        );
    }

    createRecord(value: number, type: GoalType) {
        const record = {
            value: UnitsUtils.formatWeight(value),
            dateTime: new Date(),
            type,
        };
        return this.goalsRestService
            .createRecord(this.goal.getValue().id, record)
            .pipe(
                tap(() => {
                    const goal = this.goal.getValue();
                    goal.records.push(record);
                    setTimeout(() => this.goal.next(goal), 0);
                }),
            );
    }

    updateGoalTarget(value: number) {
        const goal = this.goal.getValue();
        goal.target = value;

        return this.goalsRestService
            .patch(goal.id, goal)
            .pipe(tap(() => setTimeout(() => this.goal.next(goal), 0)));
    }

    updateInitialWeight(value: number) {
        const goal = this.goal.getValue();
        goal.initial = UnitsUtils.formatWeight(value);
        return this.goalsRestService
            .patch(goal.id, goal)
            .pipe(tap(() => setTimeout(() => this.goal.next(goal), 0)));
    }
    stepMonthYearData(startdateTime?: Date, enddateTime?: Date) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + AuthenticationService.hasToken(),
        });
        return this.http.get(
            `${environment.baseUrl}/patients/${
                this.patient.patient.backendId
            }/steps?startDateTime=` +
                startdateTime +
                `&endDateTime=` +
                enddateTime,
            { headers },
        );
    }
}
