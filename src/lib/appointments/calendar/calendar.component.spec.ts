import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LocaliseService } from '@lib/localise/localise.service';
import { WeeklyCalendarComponent } from 'app/appointments/calendar/week-calendar.component';
import { TestAppointments } from 'test/support/test-appointments';
import { LocaliseModule } from '@lib/localise/localise.module';
import { AppointmentStatus } from '../appointment-status.enum';
import { AuthenticationService } from '../../authentication/authentication.service';
import { addDays, setHours, setMinutes, startOfISOWeek } from 'date-fns';

describe('CalendarComponent', () => {
    let component: WeeklyCalendarComponent;
    let fixture: ComponentFixture<WeeklyCalendarComponent>;
    let localize: LocaliseService;

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule],
            declarations: [WeeklyCalendarComponent],
            providers: [LocaliseService],
        });
    });
    beforeEach(() => {
        describe('integrated', () => {
            fixture = TestBed.createComponent(WeeklyCalendarComponent);
            component = fixture.componentInstance;
            localize = TestBed.get(LocaliseService);
            spyOn(AuthenticationService, 'getUser').and.returnValue({
                firstDayOfWeek: 'monday',
            });
            component.appointments = [
                TestAppointments.build({
                    id: '12',
                    title: 'Appointment 10',
                    timeSlot: {
                        start: setMinutes(
                            setHours(
                                addDays(startOfISOWeek(new Date()), 5),
                                10,
                            ),
                            0,
                        ),
                        end: setMinutes(
                            setHours(
                                addDays(startOfISOWeek(new Date()), 5),
                                11,
                            ),
                            30,
                        ),
                    },
                    status: AppointmentStatus.scheduled,
                }),
                TestAppointments.build({
                    id: '13',
                    title: 'Appointment 11',
                    timeSlot: {
                        start: setMinutes(
                            setHours(
                                addDays(startOfISOWeek(new Date()), 5),
                                12,
                            ),
                            0,
                        ),
                        end: setMinutes(
                            setHours(
                                addDays(startOfISOWeek(new Date()), 5),
                                13,
                            ),
                            0,
                        ),
                    },
                    status: AppointmentStatus.updated,
                }),
                TestAppointments.build({
                    id: '14',
                    title: null,
                    timeSlot: {
                        start: setMinutes(
                            setHours(
                                addDays(startOfISOWeek(new Date()), 5),
                                13,
                            ),
                            15,
                        ),
                        end: setMinutes(
                            setHours(
                                addDays(startOfISOWeek(new Date()), 5),
                                13,
                            ),
                            45,
                        ),
                    },
                    status: AppointmentStatus.updated,
                }),
                TestAppointments.build({
                    id: '15',
                    title: 'Appointment 12',
                    timeSlot: {
                        start: setMinutes(
                            setHours(addDays(startOfISOWeek(new Date()), 5), 0),
                            0,
                        ),
                        end: setMinutes(
                            setHours(addDays(startOfISOWeek(new Date()), 5), 0),
                            0,
                        ),
                    },
                    startDateIncludesTime: false,
                    status: AppointmentStatus.updated,
                }),
                TestAppointments.build({
                    id: '16',
                    title: 'Appointment 12',
                    timeSlot: {
                        start: setMinutes(
                            setHours(
                                addDays(startOfISOWeek(new Date()), 5),
                                15,
                            ),
                            0,
                        ),
                        end: setMinutes(
                            setHours(
                                addDays(startOfISOWeek(new Date()), 5),
                                15,
                            ),
                            30,
                        ),
                    },
                    startDateIncludesTime: true,
                    status: AppointmentStatus.attended,
                }),
                TestAppointments.build({
                    id: '17',
                    title: 'Appointment Missed',
                    timeSlot: {
                        start: setMinutes(
                            setHours(
                                addDays(startOfISOWeek(new Date()), 5),
                                16,
                            ),
                            0,
                        ),
                        end: setMinutes(
                            setHours(
                                addDays(startOfISOWeek(new Date()), 5),
                                16,
                            ),
                            30,
                        ),
                    },
                    startDateIncludesTime: true,
                    status: AppointmentStatus.missed,
                }),
            ];
            fixture.detectChanges();
        });
        it('should map events', done => {
            component.getEvents(new Date(), new Date(), 'UTC', events => {
                events.forEach(event => {
                    if (event.id === '14') {
                        expect(event.title).toBe(
                            localize.fromKey('appointment'),
                        );
                        expect(event.status).toBe(AppointmentStatus.updated);
                    }
                    if (event.id === '15') {
                        expect(event.allDay).toBe(true);
                    }
                    if (event.status === AppointmentStatus.scheduled) {
                        expect(event.status).toBe(AppointmentStatus.scheduled);
                    }
                    if (event.id === '16') {
                        expect(event.status).toBe(AppointmentStatus.attended);
                    }
                    if (event.id === '17') {
                        expect(event.status).toBe(AppointmentStatus.missed);
                    }
                    done();
                });
            });
        });
    });
});
