import { TestAppointments } from 'test/support/test-appointments';
import { TestHCPs } from 'test/support/test-hcps';
import { isAppointmentVisibleToUser } from './appointment-visible-by-user';
import { ParticipantDetails } from '@lib/participants/participant-details.model';

describe('isAppointmentVisibleToUser', () => {
    let appointment;
    let user;

    beforeEach(() => {
        appointment = TestAppointments.createDietFollowUp();
        user = TestHCPs.build();
    });
    describe('when the given user is part of the appointment participants', () => {
        it('should be satisfied', () => {
            appointment.watcherDetails[0] = ParticipantDetails.map(user);
            expect(isAppointmentVisibleToUser(appointment, user)).toBeTruthy();
        });
    });

    describe('when the given user is not part of the appointment participants', () => {
        it('should not be satisfied', () => {
            expect(isAppointmentVisibleToUser(appointment, user)).toBeFalsy();
        });
    });
});
