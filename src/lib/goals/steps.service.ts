import { Injectable } from '@angular/core';
import { LocaliseService } from '@lib/localise/localise.service';
import { BarChartData } from '@lib/shared/components/bar-chart/bar-chart.component';
import { Goal, StepRecord } from '@lib/goals/goal.model';
import { StepData, StepRestService } from './step-rest.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { addDays, isSameDay, startOfWeek, lastDayOfWeek } from 'date-fns';
import { DateUtils } from '@lib/utils/date-utils';
import { map } from 'rxjs/operators';
import * as sumBy from 'lodash/sumBy';
import * as round from 'lodash/round';

@Injectable()
export class StepsService {
    currentGoal = -1;
    currentSteps = 0;

    constructor(
        private localise: LocaliseService,
        private stepsRestService: StepRestService,
    ) {}
    weeklyStepsData(goal: Goal): BarChartData {
        const seriesData = this.getCurrentWeekArray()
            .map(day => {
                const foundRecords = goal.records
                    .filter(record => isSameDay(day.date, record.dateTime))
                    .sort(
                        (record1, record2) =>
                            record2.createdDateTime.valueOf() -
                            record1.createdDateTime.valueOf(),
                    );

                day.value = foundRecords[0] ? foundRecords[0].value : 0;
                return day;
            })
            .map(day => {
                return {
                    label: day.date,
                    value: day.value,
                };
            });

        if (this.localise.getDirection() === 'rtl') {
            seriesData.reverse();
        }

        return { seriesData, threshold: this.currentGoal };
    }
    private getCurrentWeekArray() {
        const weekStartDay = DateUtils.getWeekdayIndex(
            AuthenticationService.getUser().firstDayOfWeek,
        );

        const startOfTheWeek = startOfWeek(new Date(), {
            weekStartsOn: weekStartDay,
        });

        const days = [];

        for (let i = 0; i < 7; i++) {
            days.push({ date: addDays(startOfTheWeek, i), value: 0 });
        }

        return days;
    }
    stepDateByStep(step: StepRecord) {
        return this.stepsRestService.getStepsByDates(step).pipe(
            map(result => {
                const data = <StepData[]>(<any>result);
                const today = new Date();
                const todayResult = data.filter(date => {
                    return isSameDay(new Date(date.day), today);
                });
                if (todayResult.length > 0) {
                    this.currentGoal = todayResult[0].target;
                    this.currentSteps = todayResult[0].steps;
                }
                return result;
            }),
        );
    }
    getCurrentGoal() {
        return this.currentGoal;
    }
    updateGoal(newGoal) {
        this.currentGoal = newGoal;
    }
    getCurrentSteps() {
        return this.currentSteps;
    }
    getStepsByPatientId(patientId: string) {
        const profileDay = AuthenticationService.getUser().firstDayOfWeek;
        const startDay = DateUtils.clearTime(
            startOfWeek(new Date(), {
                weekStartsOn: DateUtils.getWeekdayIndex(profileDay),
            }),
        );
        const lastWeek = lastDayOfWeek(startDay, {
            weekStartsOn: DateUtils.getWeekdayIndex(profileDay),
        });
        const steps = {
            startDateTime: startDay,
            endDateTime: DateUtils.setEndOfDay(lastWeek),
        };
        return this.stepsRestService.stepsByPatientId(patientId, steps).pipe(
            map(result => {
                const weeklyStepData = <StepData[]>(<any>result);
                const positiveDays = weeklyStepData.filter(a => {
                    return a.steps > 0;
                });
                return round(
                    sumBy(weeklyStepData, 'steps') / positiveDays.length || 0,
                );
            }),
        );
    }
}
