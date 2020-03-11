import { HospitalService } from '@lib/hospitals/hospital.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, EventEmitter } from '@angular/core';
import Spy = jasmine.Spy;

import { WeeklyCalendarComponent } from './week-calendar.component';
import { LocaliseService } from '@lib/localise/localise.service';
import { LocaliseModule } from '@lib/localise/localise.module';
import { TestAppointments } from '../../../test/support/test-appointments';
import { Appointment } from '@lib/appointments/appointment.model';
import { AppointmentStatus } from '@lib/appointments/appointment-status.enum';
import { DateRange } from '@lib/appointments/date-range';
import { of } from 'rxjs';
import { addWeeks, endOfISOWeek, startOfISOWeek } from 'date-fns';
import { DateUtils } from '@lib/utils/date-utils';

describe('WeeklyCalendarComponent', () => {
    let component: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    let page: PageObject;
    let localize: LocaliseService;
    let onAppointmentSelectedSpy: Spy;

    class PageObject {
        get todayButton(): HTMLElement {
            return fixture.nativeElement.querySelector('.fc-today-button');
        }

        get nextButton(): HTMLElement {
            return fixture.nativeElement.querySelector('.fc-next-button');
        }

        get prevButton(): HTMLElement {
            return fixture.nativeElement.querySelector('.fc-prev-button');
        }

        get events(): Array<HTMLElement> {
            return Array.from<HTMLElement>(
                fixture.nativeElement.querySelectorAll('.fc-event'),
            );
        }

        get title(): string {
            return fixture.nativeElement.querySelector('h2').textContent.trim();
        }

        getAppointmentEvent(appointment: Appointment): HTMLElement {
            return this.events.find(event => {
                const title = event
                    .querySelector('.fc-title')
                    .textContent.trim();
                return appointment.title
                    ? appointment.title === title
                    : appointment.title === 'appointment';
            });
        }

        getEventStatusLabel(event: any): HTMLElement {
            return event.querySelector('.fc-status-label');
        }
    }

    const expectedTitleFormatForRange = (from, to) => {
        return (
            DateUtils.formatDate(from, 'dd MMM') +
            ' - ' +
            DateUtils.formatDate(to, 'dd MMM yyyy')
        );
    };

    @Component({
        selector: 'app-test-host',
        template: `
            <weekly-calendar
                [appointments]="appointments"
                (onAppointmentClick)="onAppointmentClick.next($event)"
            ></weekly-calendar>
        `,
    })
    class TestHostComponent {
        appointments: Appointment[];
        onAppointmentClick = new EventEmitter();
    }

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule],
            declarations: [TestHostComponent, WeeklyCalendarComponent],
            providers: [
                LocaliseService,
                {
                    provide: HospitalService,
                    useValue: {
                        fetchHospital: () => of(),
                    },
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;

        onAppointmentSelectedSpy = jasmine.createSpy(
            'onAppointmentSelectedSpy',
        );
        component.onAppointmentClick.subscribe(onAppointmentSelectedSpy);
        component.appointments = TestAppointments.createThisWeeksAppointments();

        localize = TestBed.get(LocaliseService);

        page = new PageObject();
        fixture.detectChanges();
    });

    it('should show all the appointments passed to it', done => {
        component.appointments.forEach(appointment => {
            const event = page.getAppointmentEvent(appointment);
            expect(event).toBeTruthy(
                `Missing appointment with id: ${appointment.id}`,
            );
            done();
        });
    });

    it('should have controls to navigate the current week', () => {
        expect(page.nextButton).toBeTruthy();
        expect(page.prevButton).toBeTruthy();
    });

    it('should initially show the current week in the title', () => {
        expect(page.title).toEqual(
            expectedTitleFormatForRange(
                startOfISOWeek(new Date()),
                endOfISOWeek(new Date()),
            ),
        );
    });

    describe('declined appointment', () => {
        let declinedAppointment;

        beforeEach(() => {
            declinedAppointment = component.appointments.find(
                appointment =>
                    appointment.status === AppointmentStatus.declined,
            );
        });

        it('should have the "declined" status label', () => {
            const event = page.getAppointmentEvent(declinedAppointment);
            const statusLabel = page.getEventStatusLabel(event);
            expect(statusLabel.textContent.trim()).toContain(
                localize.fromKey('declined'),
            );
        });
    });

    describe('pending appointment', () => {
        let pendingAppointment;

        beforeEach(() => {
            pendingAppointment = component.appointments.find(
                appointment => appointment.status === AppointmentStatus.pending,
            );
        });

        it('should have the "pending" status label', () => {
            const event = page.getAppointmentEvent(pendingAppointment);
            const statusLabel = page.getEventStatusLabel(event);

            expect(statusLabel.textContent.trim()).toContain(
                localize.fromKey('pending'),
            );
        });
    });

    describe('when the navigation is used', () => {
        it('should show the new date range', () => {
            const expectedStart = addWeeks(startOfISOWeek(new Date()), 1);
            const expectedEnd = addWeeks(endOfISOWeek(new Date()), 1);

            page.nextButton.click();

            expect(page.title).toEqual(
                expectedTitleFormatForRange(expectedStart, expectedEnd),
            );
        });
    });

    describe('today button', () => {
        it('should be disabled if the current week is active', () => {
            expect(page.todayButton.hasAttribute('disabled')).toBeTruthy(
                'The today button should be disabled',
            );
        });
    });

    describe('when the today button is clicked', () => {
        beforeEach(() => {
            page.nextButton.click();
        });

        it('should show the current week', () => {
            page.todayButton.click();

            expect(page.title).toEqual(
                expectedTitleFormatForRange(
                    startOfISOWeek(new Date()),
                    endOfISOWeek(new Date()),
                ),
            );
        });
    });

    describe('when an event is clicked', () => {
        it('should call the onAppointmentSelected callback', () => {
            const eventToClick = page.events[0];

            eventToClick.click();

            expect(onAppointmentSelectedSpy).toHaveBeenCalled();
        });
    });

    describe('when the appointments input changes', () => {
        it('should render the new appointments', () => {
            const newAppointment = TestAppointments.build({
                title: 'New appointment',
                timeSlot: new DateRange(new Date(), new Date()),
            });

            component.appointments = [
                ...component.appointments,
                newAppointment,
            ];
            fixture.detectChanges();

            const event = page.getAppointmentEvent(newAppointment);
            expect(event).toBeTruthy(
                `Missing appointment with id: ${newAppointment.id}`,
            );
        });
    });
});
