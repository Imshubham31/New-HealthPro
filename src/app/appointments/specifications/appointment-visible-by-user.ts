import { Appointment } from '@lib/appointments/appointment.model';
import { User } from '@lib/authentication/user.model';
import { ParticipantDetails } from '@lib/participants/participant-details.model';

export const isAppointmentVisibleToUser = (
    appointment: Appointment,
    user: User,
) => {
    return appointment.watcherDetails.find(
        (watcher: ParticipantDetails) => watcher.backendId === user.backendId,
    );
};
