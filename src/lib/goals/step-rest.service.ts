import { Injectable } from '@angular/core';
import { StepRecord } from './goal.model';
import { HttpClient } from '@angular/common/http';
import { BaseRestService } from '../jnj-rest/base-rest.service';
import { PatientOverview } from 'app/patients/view-patient.model';
import { GoalService } from './goal.service';
import { formatISO } from 'date-fns';
@Injectable()
export class StepRestService extends BaseRestService {
    patient = new PatientOverview();
    constructor(http: HttpClient, private goalService: GoalService) {
        super(http, 'patients');
    }
    getStepsByDates(step: StepRecord) {
        const patientId = this.goalService.patient.patient.backendId;
        return this.stepsByPatientId(patientId, step);
    }
    stepsByPatientId(patientId: string, step: StepRecord) {
        return this.findOne<StepData[]>(`${patientId}/steps`, {
            subPath: `/?startDateTime=${encodeURIComponent(
                formatISO(step.startDateTime),
            )}&endDateTime=${encodeURIComponent(formatISO(step.endDateTime))}`,
        });
    }
}

export interface StepData {
    day: string;
    steps: number;
    target: number;
}
