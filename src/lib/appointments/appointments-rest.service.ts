import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseRestService } from '@lib/jnj-rest/base-rest.service';
import { Appointment } from '@lib/appointments/appointment.model';
import { AppointmentsTranslator } from '@lib/appointments/appointments.translator';
import { PatientsRestService } from 'app/patients/patients-rest.service';
import { ParticipantDetails } from '@lib/participants/participant-details.model';

export interface AppointmentApi {
    id: string;
    startDateTime: number;
    endDateTime: number;
    lastModifiedDateTime: number;
    title: string;
    reason: string;
    locationUrl: string;
    location: string;
    patientId: string;
    patientDetails: ParticipantDetails;
    watchers: string[];
    watcherDetails: ParticipantDetails[];
    status: string;
    description: string;
    subPhaseId: string;
    isIntegrated: boolean;
    startDateIncludesTime: boolean;
}

@Injectable()
export class AppointmentsRestService extends BaseRestService {
    constructor(
        httpClient: HttpClient,
        private patientsRestService: PatientsRestService,
    ) {
        super(httpClient, 'user/appointments');
    }

    createAppointment(appointment: Appointment): Observable<Appointment> {
        const resource = AppointmentsTranslator.toApi(appointment);
        return this.patientsRestService
            .create(resource, {
                subPath: `/${
                    appointment.patientDetails.backendId
                }/appointments`,
            })
            .pipe(
                map(response => {
                    appointment.id = String(response.resourceId);
                    appointment.lastModifiedDateTime = new Date();
                    return appointment;
                }),
            );
    }

    updateAppointment(appointment: Appointment): Observable<Appointment> {
        const resource = AppointmentsTranslator.toApi(appointment);
        return this.patch(appointment.id, resource).pipe(
            map(() => {
                appointment.lastModifiedDateTime = new Date();
                return appointment;
            }),
        );
    }

    deleteAppointment(appointment: Appointment) {
        return this.patch(appointment.id, {
            status: 'entered-in-error',
        });
    }

    findForPatient(id: string) {
        return this.patientsRestService.getAppointments(id);
    }
}
