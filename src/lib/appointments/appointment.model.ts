import { AppointmentStatus } from './appointment-status.enum';
import { DateRange } from './date-range';
import { Location } from './location';
import { ParticipantDetails } from '@lib/participants/participant-details.model';

export class Appointment {
    constructor(
        public title: string = null,
        public description: string = null,
        public status: AppointmentStatus = null,
        public timeSlot: DateRange = null,
        public watcherDetails: ParticipantDetails[] = [],
        public patientDetails: ParticipantDetails = null,
        public location: Location = new Location(null, null),
        public patientId: string = null,
        public lastModifiedDateTime: Date = new Date(),
        public isIntegrated = false,
        public startDateIncludesTime = true,
        public id?: string,
    ) {}

    get date(): Date {
        if (!this.timeSlot) {
            return null;
        }

        return this.timeSlot.start;
    }

    isPast() {
        return Date.now() > this.timeSlot.end.getTime();
    }
}
