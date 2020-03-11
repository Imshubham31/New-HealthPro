import { HospitalService } from '@lib/hospitals/hospital.service';
import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import SpyObj = jasmine.SpyObj;

import { PatientAppointmentsComponent } from './patient-appointments.component';
import { AppointmentsService } from '../appointments.service';
import { TestAppointments } from 'test/support/test-appointments';
import { PatientService } from '../../patients/patient.service';
import { TestDateRanges } from 'test/support/test-date-ranges';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Appointment } from '@lib/appointments/appointment.model';
import { LocaliseModule } from '@lib/localise/localise.module';
import { LocaliseService } from '@lib/localise/localise.service';
import { of } from 'rxjs';
import { TestPatientOverview } from 'test/support/test-patient-overview';
import { MockAppointmentFormFactory } from '../appointment-form/factories/mock-appointment-form.factory';

describe('PatientAppointmentsComponent', () => {
    let fixture: ComponentFixture<PatientAppointmentsComponent>;
    let page: PageObject;
    let appointmentsService: SpyObj<AppointmentsService>;
    let patientService: SpyObj<PatientService>;

    const futureAppointment = TestAppointments.build({
        timeSlot: TestDateRanges.createThisTimeTomorrow(),
    });
    const pastAppointment = TestAppointments.build({
        timeSlot: TestDateRanges.createThisTimeYesterday(),
    });
    const mockAppointments = [pastAppointment, futureAppointment];
    const testPatientOverview = TestPatientOverview.build();
    const appointmentUrlId = testPatientOverview.patient.backendId;

    class PageObject {
        get page() {
            return fixture.debugElement;
        }

        get badge() {
            return fixture.debugElement.query(By.css('.heading__badge'));
        }

        get actionButton() {
            return fixture.debugElement.query(By.css('page-action-button'));
        }

        get loadingIndicator() {
            return fixture.debugElement.query(By.css('.loading'));
        }
        get scheduleAppointmentModal() {
            return fixture.debugElement.query(
                By.css('schedule-appointment-for-patient'),
            );
        }

        get appointmentList() {
            return fixture.debugElement.query(
                By.css('patient-appointments-list'),
            );
        }

        get appointmentDetails() {
            return fixture.debugElement.query(By.css('appointment-details'));
        }

        get appConfirmationDialog() {
            return fixture.debugElement.query(
                By.css('app-confirmation-dialog'),
            );
        }

        selectAppointment(appointment: Appointment) {
            this.appointmentList.triggerEventHandler(
                'onAppointmentSelected',
                appointment,
            );
            fixture.detectChanges();
        }

        scheduleAppointment() {
            this.actionButton.triggerEventHandler('onClick', null);
            fixture.detectChanges();
        }

        deleteAppointment() {
            this.appointmentDetails.triggerEventHandler(
                'onDelete',
                this.appointmentDetails.properties.appointment,
            );
            tick();
            fixture.detectChanges();
        }

        deleteConfirmation(result: boolean) {
            this.appConfirmationDialog.triggerEventHandler('onClose', result);
            tick();
            fixture.detectChanges();
        }
    }

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule],
            declarations: [PatientAppointmentsComponent],
            providers: [
                LocaliseService,
                {
                    provide: AppointmentsService,
                    useValue: jasmine.createSpyObj('appointmentsService', [
                        'fetchPatientAppointments',
                        'getAppointments$',
                        'updateAppointment',
                        'deleteAppointment',
                    ]),
                },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            parent: {
                                params: {
                                    id: testPatientOverview.patient.backendId,
                                },
                            },
                            paramMap: convertToParamMap({
                                id: appointmentUrlId,
                            }),
                            queryParamMap: convertToParamMap({
                                appointment: null,
                            }),
                        },
                    },
                },
                {
                    provide: PatientService,
                    useValue: jasmine.createSpyObj('patientService', [
                        'getPatients$',
                    ]),
                },
                {
                    provide: Router,
                    useValue: jasmine.createSpyObj('router', ['navigate']),
                },
                {
                    provide: HospitalService,
                    useValue: {
                        hospital: new BehaviorSubject({ integrated: false }),
                        fetchHospital: () => of({}),
                    },
                },
                MockAppointmentFormFactory.buildProvider(),
            ],
            schemas: [NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PatientAppointmentsComponent);
        appointmentsService = TestBed.get(AppointmentsService);
        patientService = TestBed.get(PatientService);
        page = new PageObject();
    });

    describe('while loading', () => {
        beforeEach(() => {
            appointmentsService.fetchPatientAppointments.and.returnValue(of());
            appointmentsService.getAppointments$.and.returnValue(
                of({
                    list: [],
                    isFetching: true,
                }),
            );
            patientService.getPatients$.and.returnValue(
                of({
                    list: [],
                    isFetching: true,
                }),
            );
            fixture.detectChanges();
        });

        it('should show the loading indicator', () => {
            expect(page.loadingIndicator).toBeTruthy();
        });
    });

    describe('when loaded', () => {
        const appointments = new BehaviorSubject({
            list: mockAppointments,
            isFetching: false,
        });

        beforeEach(fakeAsync(() => {
            appointmentsService.fetchPatientAppointments.and.returnValue(
                of([]),
            );
            appointmentsService.getAppointments$.and.returnValue(appointments);
            appointmentsService.deleteAppointment.and.returnValue(of({}));
            patientService.getPatients$.and.returnValue(
                of({
                    list: [testPatientOverview],
                    isFetching: false,
                }),
            );

            fixture.detectChanges();
            tick();
            fixture.detectChanges();
        }));

        afterEach(() => {
            appointmentsService.deleteAppointment.calls.reset();
        });

        it('should have an action button', () => {
            expect(page.actionButton).toBeTruthy();
        });
        it('should show the list of appointments', () => {
            expect(page.appointmentList).toBeTruthy();
        });

        it('should show the list of appointments', () => {
            expect(page.appointmentList).toBeTruthy();
        });

        it('should show the number of upcoming appointments as the badge', () => {
            expect(page.badge.nativeElement.innerText).toEqual('1');
        });

        it('should not show a badge if there are no upcoming appointments', () => {
            appointments.next({
                list: [pastAppointment],
                isFetching: false,
            });
            fixture.detectChanges();

            expect(page.badge.nativeElement.innerText).toEqual('');
        });

        describe('content', () => {
            describe('until an appointment is selected', () => {
                it('should be empty', () => {
                    expect(page.appointmentDetails).toBeFalsy();
                });
            });

            describe('when an appointment is selected', () => {
                const selectedAppointment = mockAppointments[0];

                beforeEach(() => {
                    page.selectAppointment(selectedAppointment);
                });

                // TODO: Move these to details component
                describe('and then deleted', () => {
                    beforeEach(fakeAsync(() => {
                        page.deleteAppointment();
                    }));

                    xit('should show confirmation dialog', () => {
                        expect(page.appConfirmationDialog).toBeTruthy();
                        expect(fixture.componentInstance.showConfirmation).toBe(
                            true,
                        );
                    });

                    xit('should handle delete confirmation and delete', fakeAsync(() => {
                        page.deleteConfirmation(true);
                        expect(
                            appointmentsService.deleteAppointment,
                        ).toHaveBeenCalledWith(selectedAppointment);
                        expect(fixture.componentInstance.showConfirmation).toBe(
                            false,
                        );
                    }));

                    xit('should handle delete confirmation and cancel', fakeAsync(() => {
                        page.deleteConfirmation(false);
                        expect(
                            appointmentsService.deleteAppointment,
                        ).not.toHaveBeenCalledWith(selectedAppointment);
                        expect(fixture.componentInstance.showConfirmation).toBe(
                            false,
                        );
                    }));
                });
            });
        });
    });
});
