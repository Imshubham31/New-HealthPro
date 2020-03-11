import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { TestAppointments } from '../../test/support/test-appointments';
import { TestPathways } from '../../test/support/test-pathways';
import { TestPatientOverview } from '../../test/support/test-patient-overview';
import { HcpService } from '../hcp/hcp.service';
import { LocaliseService } from '@lib/localise/localise.service';
import { MDTService } from '../mdt/mdt.service';
import { PathWayService } from '@lib/pathway/pathway.service';
import { PatientService } from '../patients/patient.service';
import { ToastService } from '@lib/shared/components/toast/toast.service';
import { AppointmentsService } from './appointments.service';
import SpyObj = jasmine.SpyObj;
import {
    AppointmentsRestService,
    AppointmentApi,
} from '@lib/appointments/appointments-rest.service';
import { Appointment } from '@lib/appointments/appointment.model';
import { AppointmentsTranslator } from '@lib/appointments/appointments.translator';
import { of } from 'rxjs';
import { AppointmentStatus } from '@lib/appointments/appointment-status.enum';

describe('HcpAppointmentsService', () => {
    let service: AppointmentsService;
    let restService: SpyObj<AppointmentsRestService>;
    let toastService: SpyObj<ToastService>;
    let localize: SpyObj<LocaliseService>;
    let patientService: SpyObj<PatientService>;
    let HCPsService: SpyObj<HcpService>;
    let pathwayService: SpyObj<PathWayService>;
    let appointment: Appointment;
    let appointmentFromApi: AppointmentApi;
    let fixtures;
    beforeEach(() => {
        appointment = TestAppointments.createDietFollowUp();
        appointmentFromApi = fromApi(appointment);
        fixtures = {
            appointment,
            appointmentFromApi,
            patientOverview: {
                patient: {
                    backendId: 42,
                    pathwayId: '42',
                },
            },
        };
    });

    const patientStore = {
        list: [TestPatientOverview.build()],
        isFetching: false,
    };

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            providers: [
                AppointmentsService,
                {
                    provide: AppointmentsRestService,
                    useValue: jasmine.createSpyObj('appointmentsRestService', [
                        'createAppointment',
                        'updateAppointment',
                        'deleteAppointment',
                        'findOne',
                        'findForPatient',
                        'find',
                    ]),
                },
                {
                    provide: HcpService,
                    useValue: jasmine.createSpyObj('hcpRestService', {
                        getHCPs$: of([]),
                        fetchHcps: of(),
                    }),
                },
                {
                    provide: PatientService,
                    useValue: jasmine.createSpyObj('patient', {
                        getPatients$: of(patientStore),
                        fetchPatientWithId: of(patientStore),
                        fetchPatients: of(patientStore),
                    }),
                },
                {
                    provide: PathWayService,
                    useValue: jasmine.createSpyObj('pathwayService', {
                        getPathways$: of({
                            list: [TestPathways.build()],
                        }),
                        getPathwayById$: of(TestPathways.build()),
                    }),
                },
                {
                    provide: LocaliseService,
                    useValue: jasmine.createSpyObj('localiseService', [
                        'fromKey',
                        'fromParams',
                    ]),
                },
                {
                    provide: ToastService,
                    useValue: jasmine.createSpyObj('ToastService', ['show']),
                },
                {
                    provide: MDTService,
                    useValue: jasmine.createSpyObj('mdtService', [
                        'fetchMdtForPatient',
                    ]),
                },
            ],
        });

        service = TestBed.get(AppointmentsService);
        restService = TestBed.get(AppointmentsRestService);
        patientService = TestBed.get(PatientService);
        HCPsService = TestBed.get(HcpService);
        toastService = TestBed.get(ToastService);
        localize = TestBed.get(LocaliseService);
        pathwayService = TestBed.get(PathWayService);
    });

    describe('#fetchAppointment(id)', () => {
        beforeEach(fakeAsync(() => {
            restService.findOne.and.returnValue(
                of({ data: fixtures.appointmentFromApi }),
            );
            patientService.fetchPatients.and.returnValue(
                of([fixtures.patientOverview.patient]),
            );
            patientService.fetchPatientWithId.and.returnValue(
                of(fixtures.patientOverview),
            );
            HCPsService.fetchHcps.and.returnValue(of([]));

            service.fetchAppointment(appointmentFromApi.id).subscribe();
            tick();
        }));

        it('should fetch the given appointment', done => {
            expect(restService.findOne).toHaveBeenCalledWith(
                appointmentFromApi.id,
            );
            service
                .getAppointments$()
                .take(1)
                .subscribe(store => {
                    expect(store.list.length).toEqual(1);
                    assertApptEqualsApiResponse(
                        store.list[0],
                        appointmentFromApi,
                    );
                    done();
                });
        });
    });

    describe('#fetchPatientAppointments(id)', () => {
        beforeEach(fakeAsync(() => {
            restService.findForPatient.and.returnValue(
                of([appointmentFromApi]),
            );
            patientService.fetchPatientWithId.and.returnValue(
                of(fixtures.patientOverview),
            );

            service
                .fetchPatientAppointments(
                    appointmentFromApi.patientDetails.backendId,
                )
                .subscribe();
            tick();
        }));

        it('should fetch the patients appointments', done => {
            expect(restService.findForPatient).toHaveBeenCalledWith(
                appointmentFromApi.patientDetails.backendId,
            );
            service
                .getAppointments$()
                .take(1)
                .subscribe(store => {
                    expect(store.list.length).toEqual(1);
                    assertApptEqualsApiResponse(
                        store.list[0],
                        appointmentFromApi,
                    );
                    done();
                });
        });

        it('should fetch the patient', () => {
            expect(patientService.fetchPatientWithId).toHaveBeenCalledWith(
                appointmentFromApi.patientDetails.backendId,
            );
        });

        it('should fetch the patient pathway', () => {
            expect(pathwayService.getPathwayById$).toHaveBeenCalledWith(
                Number(fixtures.patientOverview.patient.pathwayId),
            );
        });
    });

    describe('#fetchAppointmentsForHCP()', () => {
        beforeEach(fakeAsync(() => {
            restService.find.and.returnValue(
                of({ data: [appointmentFromApi] }),
            );

            service.fetchAppointmentsForHCP().subscribe();
            tick();
        }));

        it('should fetch the HCP appointments', done => {
            expect(restService.find).toHaveBeenCalled();
            service
                .getAppointments$()
                .take(1)
                .subscribe(store => {
                    expect(store.list.length).toEqual(1);
                    assertApptEqualsApiResponse(
                        store.list[0],
                        appointmentFromApi,
                    );
                    done();
                });
        });
    });

    describe('#fetchAppointmentsForHCP()', () => {
        it('should not store cancelled or deleted appointments', done => {
            const accepted = fromApi(TestAppointments.createDietFollowUp());
            const cancelled = fromApi(
                TestAppointments.build({
                    status: AppointmentStatus.cancelled,
                }),
            );
            const deleted = fromApi(
                TestAppointments.build({
                    status: AppointmentStatus.deleted,
                }),
            );
            restService.find.and.returnValue(
                of({ data: [accepted, cancelled, deleted] }),
            );
            service.fetchAppointmentsForHCP().subscribe();
            service
                .getAppointments$()
                .take(1)
                .subscribe(store => {
                    expect(store.list.length).toEqual(1);
                    done();
                });
        });
    });

    describe('#fetchPatientAppointments()', () => {
        it('should not store cancelled or deleted appointments', done => {
            const accepted = fromApi(TestAppointments.createDietFollowUp());
            const cancelled = fromApi(
                TestAppointments.build({
                    status: AppointmentStatus.cancelled,
                }),
            );
            const deleted = fromApi(
                TestAppointments.build({
                    status: AppointmentStatus.deleted,
                }),
            );
            const patient = TestPatientOverview.build();
            restService.findForPatient.and.returnValue(
                of([accepted, cancelled, deleted]),
            );
            patientService.fetchPatientWithId.and.returnValue(
                of(TestPatientOverview.build()),
            );
            pathwayService.getPathwayById$.and.returnValue(
                of(TestPathways.build()),
            );
            service
                .fetchPatientAppointments(patient.patient.backendId)
                .subscribe();
            service
                .getAppointments$()
                .take(1)
                .subscribe(store => {
                    expect(store.list.length).toEqual(1);
                    done();
                });
        });
    });

    function assertApptEqualsApiResponse(
        appt: Appointment,
        api: AppointmentApi,
    ) {
        expect(appt.title).toEqual(api.title);
        expect(appt.description).toEqual(api.description);
        expect(appt.timeSlot.end.valueOf() / 1000).toEqual(api.endDateTime);
        expect(appt.timeSlot.start.valueOf() / 1000).toEqual(api.startDateTime);
    }

    describe('#saveAppointment(appointment)', () => {
        describe('when the appointment is new', () => {
            const translation = '';

            beforeEach(done => {
                restService.createAppointment.and.returnValue(
                    of({ resourceId: '1' }),
                );
                localize.fromParams.and.returnValue(translation);
                localize.fromKey.and.returnValue(translation);
                delete appointment.id;

                service
                    .saveAppointment(appointment, true)
                    .subscribe(() => done());
            });

            xit('should set the isSaving flag', () => {
                service
                    .getAppointments$()
                    .take(1)
                    .subscribe(state => {
                        expect(state.isSaving).toBeTruthy();
                    });
            });

            it('should call the createAppointment method on the rest service', () => {
                expect(restService.createAppointment).toHaveBeenCalledWith(
                    appointment,
                );
            });

            xdescribe('when the request is done', () => {
                beforeEach(fakeAsync(() => {
                    // response.next(fixtures.appointment);
                    // response.complete();
                    tick();
                }));

                it('should unset the isSaving flag', () => {
                    service
                        .getAppointments$()
                        .take(1)
                        .subscribe(state => {
                            expect(state.isSaving).toBeFalsy();
                        });
                });

                it('should notify the toast service', () => {
                    expect(localize.fromKey).toHaveBeenCalledWith(
                        'createAppointmentSuccess',
                    );
                    expect(toastService.show).toHaveBeenCalledWith(
                        null,
                        translation,
                    );
                });

                it('should add the appointment to the state', () => {
                    service
                        .getAppointments$()
                        .take(1)
                        .subscribe(state => {
                            // TODO: objectContaining(appointment)
                            expect(state.list).toContain(
                                jasmine.objectContaining({
                                    title: appointment.title,
                                }),
                            );
                        });
                });
            });

            xit('should store all errors', fakeAsync(() => {
                // response.error(new Error());
                tick();

                service
                    .getAppointments$()
                    .take(1)
                    .subscribe(state => {
                        expect(state.errors.length).toEqual(1);
                    });
            }));
        });

        describe('when the appointment exists', () => {
            const translation = 'update';

            beforeEach(() => {
                addAppointmentsToStore([appointment, TestAppointments.build()]);
            });

            beforeEach(() => {
                restService.updateAppointment.and.returnValue(
                    of({ message: 'success' }),
                );
                localize.fromParams.and.returnValue(translation);
                localize.fromKey.and.returnValue(translation);

                service.saveAppointment(appointment).subscribe();
            });

            xit('should set the isSaving flag', () => {
                service
                    .getAppointments$()
                    .take(1)
                    .subscribe(state => {
                        expect(state.isSaving).toBeTruthy();
                    });
            });

            it('should call the updateAppointment method on the rest service', () => {
                expect(restService.updateAppointment).toHaveBeenCalledWith(
                    appointment,
                );
            });

            xdescribe('when the request is done', () => {
                beforeEach(fakeAsync(() => {
                    // response.next(fixtures.appointment);
                    // response.complete();
                    tick();
                }));

                it('should unset the isSaving flag', () => {
                    service
                        .getAppointments$()
                        .take(1)
                        .subscribe(state => {
                            expect(state.isSaving).toBeFalsy();
                        });
                });

                it('should notify the toast service', () => {
                    expect(localize.fromKey).toHaveBeenCalledWith(
                        'updateAppointmentSuccess',
                    );
                    expect(toastService.show).toHaveBeenCalledWith(
                        null,
                        translation,
                    );
                });
            });

            xit('should store all errors', fakeAsync(() => {
                // response.error(new Error());
                tick();

                service
                    .getAppointments$()
                    .take(1)
                    .subscribe(state => {
                        expect(state.errors.length).toEqual(1);
                    });
            }));
        });
    });

    describe('#deleteAppointment(appointment)', () => {
        beforeEach(() => {
            addAppointmentsToStore([appointment]);
        });

        beforeEach(fakeAsync(() => {
            restService.deleteAppointment.and.returnValue(of({}));

            service.deleteAppointment(appointment);
            tick();
        }));

        it('should call deleteAppointment on the rest service', () => {
            expect(restService.deleteAppointment).toHaveBeenCalledWith(
                appointment,
            );
        });

        xdescribe('when done', () => {
            it('should remove the appointment from the state', () => {
                service
                    .getAppointments$()
                    .take(1)
                    .subscribe(state => {
                        expect(state.list).toEqual([]);
                    });
            });

            it('should call show on toastService', () => {
                expect(toastService.show).toHaveBeenCalled();
            });
        });
    });

    function addAppointmentsToStore(appointments) {
        fakeAsync(() => {
            restService.find.and.returnValue(
                of(appointments.map(AppointmentsTranslator.toApi)),
            );
            service.fetchAppointmentsForHCP();
            tick();
        })();
    }

    function fromApi(appt: Appointment) {
        const mapped = AppointmentsTranslator.toApi(appt);
        mapped.watcherDetails = appt.watcherDetails;
        return mapped;
    }
});
