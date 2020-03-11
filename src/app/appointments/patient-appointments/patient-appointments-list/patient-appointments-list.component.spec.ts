import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    Component,
    DebugElement,
    Input,
    NO_ERRORS_SCHEMA,
} from '@angular/core';
import { By } from '@angular/platform-browser';

import { PatientAppointmentsListComponent } from './patient-appointments-list.component';
import { TestAppointments } from '../../../../test/support/test-appointments';
import { DateRange } from '@lib/appointments/date-range';
import { LocaliseService } from '@lib/localise/localise.service';
import { LocaliseModule } from '@lib/localise/localise.module';
import { Appointment } from '@lib/appointments/appointment.model';
import { TestDateRanges } from '../../../../test/support/test-date-ranges';
import { SharedModule } from '@lib/shared/shared.module';
import { Router } from '@angular/router';
import { addMonths, addYears, startOfYear } from 'date-fns';
import { DateUtils } from '@lib/utils/date-utils';

describe('PatientAppointmentsListComponent', () => {
    let component: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    let page: PageObject;
    let localize: LocaliseService;
    let routerSpy: jasmine.SpyObj<Router>;

    const date = startOfYear(new Date());
    const mockAppointments = {
        upcomingAppointments: {
            thisMonthAppointments: [
                // need 2 for this month to verify adding to group
                TestAppointments.build({
                    timeSlot: TestDateRanges.createThisTimeTomorrow(date),
                }),
                TestAppointments.build({
                    timeSlot: TestDateRanges.createThisTimeTomorrow(date),
                }),
            ],
            nextMonthAppointments: [
                TestAppointments.build({
                    timeSlot: new DateRange(
                        addMonths(date, 1),
                        addMonths(date, 1),
                    ),
                }),
            ],
            nextYearAppointments: [
                TestAppointments.build({
                    timeSlot: new DateRange(
                        addYears(date, 1),
                        addYears(date, 1),
                    ),
                }),
            ],
        },
        pastAppointments: [
            TestAppointments.build({
                timeSlot: TestDateRanges.createThisTimeYesterday(date),
            }),
            TestAppointments.build({
                timeSlot: TestDateRanges.createThisTimeYesterday(date),
            }),
        ],
    };

    const expectAppointmentsInGroup = (appointments, groupName) => {
        const group = page.findGroupForMonth(groupName);
        expect(group).toBeTruthy(`The group ${groupName} is missing`);
        expect(appointments.length).toBeGreaterThan(0);
        appointments.forEach(appointment => {
            const appointmentDisplayed = page
                .getAppointmentsInGroup(group)
                .some(
                    appointmentInGroup =>
                        appointmentInGroup.properties.appointment ===
                        appointment,
                );

            expect(appointmentDisplayed).toBeTruthy();
        });
    };

    class PageObject {
        findGroupForMonth(monthName): DebugElement {
            return fixture.debugElement
                .queryAll(By.css('.group'))
                .find(
                    group =>
                        group.query(By.css('.heading .month')).nativeElement
                            .textContent === monthName,
                );
        }

        getAppointmentsInGroup(group: DebugElement): Array<DebugElement> {
            return group.queryAll(By.css('patient-appointments-list-item'));
        }

        selectAppointment(appointment: Appointment) {
            fixture.debugElement
                .queryAll(By.css('patient-appointments-list-item'))
                .find(
                    listItem => listItem.properties.appointment === appointment,
                )
                .triggerEventHandler('click', null);
        }
    }

    @Component({
        template: `
            <patient-appointments-list
                [appointments]="appointments"
            ></patient-appointments-list>
        `,
    })
    class TestHostComponent {
        @Input() appointments: Array<Appointment>;
    }

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule, SharedModule],
            declarations: [TestHostComponent, PatientAppointmentsListComponent],
            providers: [
                LocaliseService,
                {
                    provide: Router,
                    useValue: jasmine.createSpyObj('router', [
                        'navigate',
                        'isActive',
                    ]),
                },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        jasmine.clock().mockDate(date);

        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        component.appointments = [
            ...mockAppointments.upcomingAppointments.thisMonthAppointments,
            ...mockAppointments.upcomingAppointments.nextMonthAppointments,
            ...mockAppointments.upcomingAppointments.nextYearAppointments,
            ...mockAppointments.pastAppointments,
        ];
        routerSpy = TestBed.get(Router);

        localize = TestBed.get(LocaliseService);

        fixture.detectChanges();
        page = new PageObject();
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    it('should show this years appointments grouped by month', () => {
        const thisMonthName = DateUtils.formatDate(date, 'MMMM');
        const nextMonthName = DateUtils.formatDate(addMonths(date, 1), 'MMMM');

        expectAppointmentsInGroup(
            mockAppointments.upcomingAppointments.thisMonthAppointments,
            thisMonthName,
        );
        expectAppointmentsInGroup(
            mockAppointments.upcomingAppointments.nextMonthAppointments,
            nextMonthName,
        );
    });

    it('should next year appointments grouped by month, with a year indicator', () => {
        const name = DateUtils.formatDate(addYears(date, 1), 'MMMM, yyyy');

        expectAppointmentsInGroup(
            mockAppointments.upcomingAppointments.nextYearAppointments,
            name,
        );
    });

    it('should show attendances in the "Past appointments" group', () => {
        const groupName = localize.fromKey('pastAppointments');

        expectAppointmentsInGroup(mockAppointments.pastAppointments, groupName);
    });

    describe('when an appointment is selected', () => {
        it('should call the "onAppointmentSelected" callback', () => {
            const appointment = component.appointments[0];
            page.selectAppointment(appointment);
            expect(routerSpy.navigate).toHaveBeenCalledWith([
                `appointments/user/${appointment.patientId}`,
                { outlets: { master: 'all', detail: appointment.id } },
            ]);
        });
    });
});
