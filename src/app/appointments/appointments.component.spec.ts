import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import SpyObj = jasmine.SpyObj;

import { LocaliseModule } from '@lib/localise/localise.module';
import { LocaliseService } from '@lib/localise/localise.service';
import { AppointmentsComponent } from './appointments.component';
import { TestAppointments } from 'test/support/test-appointments';
import { AppointmentsService } from './appointments.service';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { TestHCPs } from 'test/support/test-hcps';
import { Appointment } from '@lib/appointments/appointment.model';
import { of } from 'rxjs';
import { HospitalService } from '@lib/hospitals/hospital.service';
import { MockAppointmentFormFactory } from './appointment-form/factories/mock-appointment-form.factory';
import { ParticipantDetails } from '@lib/participants/participant-details.model';

describe('AppointmentsComponent', () => {
    let fixture: ComponentFixture<AppointmentsComponent>;
    let localize: LocaliseService;
    let service: SpyObj<AppointmentsService>;
    let page: PageObject;
    let router: SpyObj<Router>;

    let usersAppointments: Appointment[];
    let otherAppointments: Appointment[];

    class PageObject {
        page: DebugElement;
        pageActionButton: DebugElement;
        appCalendar: DebugElement;

        fetchElements() {
            this.page = fixture.debugElement.query(By.css('page-container'));
            this.pageActionButton = this.page.query(
                By.css('page-action-button'),
            );
            this.appCalendar = this.page.query(By.css('weekly-calendar'));
        }
    }

    beforeEach(() => {
        const user = TestHCPs.createDrCollins();
        AuthenticationService.setUser(user);
        usersAppointments = [
            TestAppointments.build({
                watcherDetails: [ParticipantDetails.map(user)],
            }),
        ];
        otherAppointments = [TestAppointments.build()];
    });

    afterEach(() => {
        AuthenticationService.deleteUser();
    });

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            declarations: [AppointmentsComponent],
            imports: [LocaliseModule],
            providers: [
                LocaliseService,
                {
                    provide: AppointmentsService,
                    useValue: jasmine.createSpyObj('appointmentsService', [
                        'fetchAppointmentsForHCP',
                        'getAppointments$',
                    ]),
                },
                {
                    provide: Router,
                    useValue: jasmine.createSpyObj('router', ['navigate']),
                },
                {
                    provide: HospitalService,
                    useValue: {
                        fetchHospital: () => of({}),
                        hospital: of({}),
                    },
                },
                MockAppointmentFormFactory.buildProvider(),
            ],
            schemas: [NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AppointmentsComponent);
        localize = TestBed.get(LocaliseService);
        service = TestBed.get(AppointmentsService);
        router = TestBed.get(Router);
        page = new PageObject();
    });

    describe('when the appointments have loaded', () => {
        beforeEach(() => {
            service.fetchAppointmentsForHCP.and.returnValue(
                of([...usersAppointments, ...otherAppointments]),
            );
            service.getAppointments$.and.returnValue(
                of({
                    list: [...usersAppointments, ...otherAppointments],
                    isFetching: false,
                }),
            );

            fixture.detectChanges();
            page.fetchElements();
        });

        it('should show the page component', () => {
            expect(page.page).toBeTruthy();
        });

        it('should have the title "yourAppointments"', () => {
            expect(page.page.properties.title).toEqual(
                localize.fromKey('yourAppointments'),
            );
        });

        it('should have the page action button', () => {
            expect(page.pageActionButton).toBeTruthy();
        });

        describe('page action button', () => {
            it('should have the text "scheduleNewAppointment"', () => {
                expect(page.pageActionButton.properties.text).toEqual(
                    localize.fromKey('scheduleNewAppointment'),
                );
            });
        });

        it('should show the appointments calendar as content', () => {
            expect(page.appCalendar).toBeTruthy();
        });

        it('should fetch the appointments on init', () => {
            expect(service.fetchAppointmentsForHCP).toHaveBeenCalled();
        });

        describe('appointments calendar', () => {
            it('should show all appointments relevant for the current user', () => {
                expect(page.appCalendar.properties.appointments).toEqual(
                    usersAppointments,
                );
            });
        });

        it('should navigate to the appointment when it is selected', () => {
            const appointment = usersAppointments[0];

            page.appCalendar.triggerEventHandler(
                'onAppointmentClick',
                appointment,
            );

            expect(router.navigate).toHaveBeenCalledWith([
                '/appointments',
                appointment.id,
            ]);
        });
    });
});
