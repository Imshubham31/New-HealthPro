import { AppointmentStatus } from './appointment-status.enum';
import { Appointment } from './appointment.model';
import { DateRange } from './date-range';
import { Location } from './location';
import { AppointmentApi } from '@lib/appointments/appointments-rest.service';
import * as invert from 'lodash/invert';
import { ParticipantDetails } from '@lib/participants/participant-details.model';

export class AppointmentsTranslator {
    static statusMap = {
        proposed: AppointmentStatus.pending,
        accepted: AppointmentStatus.accepted,
        declined: AppointmentStatus.declined,
        'entered-in-error': AppointmentStatus.deleted,
        scheduled: AppointmentStatus.scheduled,
        updated: AppointmentStatus.updated,
        cancelled: AppointmentStatus.cancelled,
        attended: AppointmentStatus.attended,
        missed: AppointmentStatus.missed,
    };
    static toApi(appointment: Appointment): AppointmentApi {
        const object: any = {
            patientId: appointment.patientId,
            startDateTime: Math.round(
                appointment.timeSlot.start.getTime() / 1000,
            ),
            endDateTime: Math.round(appointment.timeSlot.end.getTime() / 1000),
            watchers: appointment.watcherDetails.map(
                watcher => watcher.backendId,
            ),
            title: appointment.title,
            description: appointment.description,
            location: appointment.location.name,
            locationUrl: appointment.location.url,
            status: invert(AppointmentsTranslator.statusMap)[
                appointment.status
            ],
            patientDetails: appointment.patientDetails,
            isIntegrated: appointment.isIntegrated,
        };

        if (appointment.id) {
            object.id = appointment.id.toString();
        }

        return object;
    }

    // todo: data should be typed as the response
    static fromApi(data: any) {
        const appointment = new Appointment(
            data.title,
            data.description,
            data.status
                ? AppointmentsTranslator.statusMap[data.status]
                : AppointmentStatus.pending,
            new DateRange(
                new Date(data.startDateTime * 1000),
                new Date(data.endDateTime * 1000),
            ),
            data.watcherDetails.map(details =>
                ParticipantDetails.parse(details),
            ),
            ParticipantDetails.parse(data.patientDetails),
            new Location(data.location, data.locationUrl),
            data.patientId,
            new Date(data.lastModifiedDateTime * 1000),
            data.isIntegrated,
            data.startDateIncludesTime,
            data.id,
        );

        return appointment;
    }
}
