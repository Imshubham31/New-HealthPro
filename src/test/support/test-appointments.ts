import { AppointmentStatus } from '@lib/appointments/appointment-status.enum';
import { Appointment } from '@lib/appointments/appointment.model';
import { TestHCPs } from './test-hcps';
import { Location } from '@lib/appointments/location';
import { TestPatients } from './test-patients';
import { TestDateRanges } from './test-date-ranges';
import { AppointmentsTranslator } from '@lib/appointments/appointments.translator';
import { ParticipantDetails } from '@lib/participants/participant-details.model';
import { DateUtils } from '@lib/utils/date-utils';
import { addDays, setHours, setMinutes, startOfISOWeek } from 'date-fns';

export class TestAppointments {
    static build({
        id = '42',
        timeSlot = TestDateRanges.createThisTimeTomorrow(),
        title = 'Title',
        status = AppointmentStatus.accepted,
        watcherDetails = [ParticipantDetails.map(TestHCPs.build())],
        patient = TestPatients.createEvaGriffiths(),
        location = new Location('test', 'test'),
        description = 'Lorem ipsum',
        isIntegrated = false,
        startDateIncludesTime = true,
        lastModifiedTime = new Date(),
    } = {}): Appointment {
        const appointment = new Appointment(
            title,
            description,
            status,
            timeSlot,
            watcherDetails,
            ParticipantDetails.map(patient),
            location,
            patient.backendId,
            new Date(),
            isIntegrated,
            startDateIncludesTime,
            id,
        );

        return appointment;
    }

    static createDietFollowUp() {
        return TestAppointments.build({
            id: '1',
            title: 'Follow-up on diet',
            location: new Location(
                'UZ Sint Jan - room 512',
                'http://www.google.com',
            ),
            lastModifiedTime: DateUtils.clearTime(new Date()),
            watcherDetails: [
                ParticipantDetails.map(TestHCPs.createDrCollins()),
            ],
        });
    }

    static createThisWeeksAppointments() {
        const startOfWeek = () =>
            DateUtils.clearTime(startOfISOWeek(new Date()));

        return [
            TestAppointments.build({
                id: '3',
                title: 'Appointment 1',
                timeSlot: {
                    start: setHours(startOfWeek(), 8),
                    end: setHours(startOfWeek(), 11),
                },
            }),
            TestAppointments.build({
                id: '4',
                title: 'Appointment 2',
                timeSlot: {
                    start: setHours(startOfWeek(), 11),
                    end: setHours(startOfWeek(), 12),
                },
                status: AppointmentStatus.pending,
            }),
            TestAppointments.build({
                id: '5',
                title: 'Appointment 3',
                timeSlot: {
                    start: setHours(startOfWeek(), 13),
                    end: setHours(startOfWeek(), 17),
                },
                status: AppointmentStatus.pending,
            }),
            TestAppointments.build({
                id: '6',
                title: 'Appointment 4',
                timeSlot: {
                    start: setHours(addDays(startOfWeek(), 1), 10),
                    end: setHours(addDays(startOfWeek(), 1), 12),
                },
                status: AppointmentStatus.declined,
            }),
            TestAppointments.build({
                id: '7',
                title: 'Appointment 5',
                timeSlot: {
                    start: setHours(addDays(startOfWeek(), 2), 13),
                    end: setHours(addDays(startOfWeek(), 2), 15),
                },
            }),
            TestAppointments.build({
                id: '8',
                title: 'Appointment 6',
                timeSlot: {
                    start: setHours(addDays(startOfWeek(), 3), 9),
                    end: setHours(addDays(startOfWeek(), 3), 13),
                },
            }),
            TestAppointments.build({
                id: '9',
                title: 'Appointment 7',
                timeSlot: {
                    start: setHours(addDays(startOfWeek(), 3), 22),
                    end: setHours(addDays(startOfWeek(), 3), 0),
                },
            }),
            TestAppointments.build({
                id: '10',
                title: 'Appointment 8',
                timeSlot: {
                    start: setHours(addDays(startOfWeek(), 4), 10),
                    end: setHours(addDays(startOfWeek(), 4), 12),
                },
            }),
            TestAppointments.build({
                id: '11',
                title: 'Appointment 9',
                timeSlot: {
                    start: setHours(addDays(startOfWeek(), 6), 10),
                    end: setMinutes(
                        setHours(addDays(startOfWeek(), 6), 14),
                        30,
                    ),
                },
            }),
        ];
    }

    static createThisWeeksAppApiResponse() {
        return this.createThisWeeksAppointments().map(appointment => {
            return AppointmentsTranslator.toApi(appointment);
        });
    }
}
