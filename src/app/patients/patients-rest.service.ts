import { Surgery } from './surgery.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppointmentApi } from '@lib/appointments/appointments-rest.service';
import { Goal } from '@lib/goals/goal.model';
import { MedicalRecord } from '@lib/goals/medical-record.model';
import { BaseRestService } from '@lib/jnj-rest/base-rest.service';
import { Observable } from 'rxjs';

import { HcpNote } from '../hcp-notes/hcp-notes.model';
import { MDTs } from 'app/mdts/mdts.model';
import { MdtsHcps } from './patient.model';

@Injectable()
export class PatientsRestService extends BaseRestService {
    constructor(http: HttpClient) {
        super(http, 'patients');
    }

    findConsultationNotes(patientId: string) {
        return super.find<HcpNote>({
            subPath: `/${patientId}/consultation-notes`,
        });
    }

    createConsultationNote(patientId: string, hcpNote: HcpNote) {
        return super.create<HcpNote>(hcpNote, {
            subPath: `/${patientId}/consultation-notes`,
        });
    }

    updateConsultationNote(hcpNote: HcpNote, gxpReason: string) {
        return super.update(null, hcpNote, {
            subPath: `/${hcpNote.patientId}/consultation-notes/${hcpNote.id}`,
            gxpReason,
        });
    }

    getAppointments(id: string): Observable<AppointmentApi[]> {
        return super
            .find<AppointmentApi>({ subPath: `/${id}/appointments` })
            .map(response => response.data);
    }

    getGoals(id: string): Observable<Goal[]> {
        return super
            .find<Goal>({ subPath: `/${id}/goals` })
            .map(response => response.data);
    }

    updateHeight(patientId: string, height: number) {
        return this.create(
            { height },
            { subPath: `/${patientId}/medicalrecords` },
        );
    }

    getLatestHeight(patientId: string) {
        const params = new HttpParams().set('type', 'height').set('limit', '1');
        return super.find<MedicalRecord>({
            params,
            subPath: `/${patientId}/medicalrecords`,
        });
    }

    changePathway(
        patientId: string,
        data: {
            pathwayId: string;
            caremoduleId: string;
            surgery: Surgery;
            personalMdt: { hcps: string[] };
            sharedMdtIds: string[];
        },
    ) {
        return super.create(data, {
            subPath: `/${patientId}/switch-pathway`,
        });
    }

    getPatientMdtsWithId(patientId: string) {
        return super.find<MDTs>({
            subPath: `/${patientId}/mdts`,
        });
    }

    updatePatientMdtsWithId(patientId: string, mdtsHcps: MdtsHcps) {
        return super.update(null, mdtsHcps, {
            subPath: `/${patientId}/mdts`,
        });
    }
}
