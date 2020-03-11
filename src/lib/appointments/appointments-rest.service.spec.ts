import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import SpyObj = jasmine.SpyObj;

import {
    AppointmentsRestService,
    AppointmentApi,
} from '@lib/appointments/appointments-rest.service';
import { TestAppointments } from 'test/support/test-appointments';
import { PatientService } from 'app/patients/patient.service';
import { TestHCPs } from 'test/support/test-hcps';
import { TestPatients } from 'test/support/test-patients';
import { HCPRestService } from 'app/hcp/hcp.rest-service';
import { PatientsRestService } from 'app/patients/patients-rest.service';
import { AppointmentsTranslator } from '@lib/appointments/appointments.translator';
import { of } from 'rxjs';
import { Appointment } from '@lib/appointments/appointment.model';

describe('AppointmentsRestService', () => {
    let restService: AppointmentsRestService;
    let mockBackend: HttpTestingController;
    let patientsRestService: SpyObj<PatientsRestService>;

    const testHCPs = [TestHCPs.createDrCollins()];
    const testPatients = [TestPatients.createEvaGriffiths()];
    const mockedDateForLastModified = new Date();

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [
                AppointmentsRestService,
                {
                    provide: HCPRestService,
                    useValue: {
                        fetchHcps: () => of(testHCPs),
                    },
                },
                {
                    provide: PatientService,
                    useValue: {
                        fetchPatients: () => of(testPatients),
                    },
                },
                {
                    provide: PatientsRestService,
                    useValue: jasmine.createSpyObj('patientsRestService', [
                        'getAppointments',
                        'create',
                    ]),
                },
            ],
        });

        restService = TestBed.get(AppointmentsRestService);
        mockBackend = TestBed.get(HttpTestingController);
        patientsRestService = TestBed.get(PatientsRestService);
    });

    beforeEach(() => {
        jasmine.clock().mockDate(mockedDateForLastModified);
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    describe('#findForPatient(id)', () => {
        it('should convert the returned object to an appointment', () => {
            const id = '42';
            const response = [
                AppointmentsTranslator.toApi(
                    TestAppointments.createDietFollowUp(),
                ),
            ];
            patientsRestService.getAppointments.and.returnValue(of(response));

            restService.findForPatient(id).subscribe(resp => {
                expect(resp).toEqual(response);
            });

            expect(patientsRestService.getAppointments).toHaveBeenCalledWith(
                id,
            );
        });
    });

    describe('#findForHCP()', () => {
        it('should GET from the appointments endpoint', () => {
            const mockResponse = [
                AppointmentsTranslator.toApi(
                    TestAppointments.createDietFollowUp(),
                ),
            ];

            restService.find<AppointmentApi>().subscribe(response => {
                expect(response.data).toEqual(mockResponse);
            });

            mockBackend
                .expectOne((req: HttpRequest<any>) => {
                    expect(req.method).toEqual('GET');
                    expect(req.url).toContain('user/appointments');
                    return true;
                })
                .flush({ data: mockResponse });
            mockBackend.verify();
        });
    });

    describe('#findOneForHCP()', () => {
        it('should GET from the appointments endpoint with the HCP id', () => {
            const HCPId = '42';
            const mockResponse = [
                AppointmentsTranslator.toApi(
                    TestAppointments.createDietFollowUp(),
                ),
            ];

            restService.findOne(HCPId).subscribe(response => {
                expect(response.data).toEqual(mockResponse);
            });

            mockBackend
                .expectOne((req: HttpRequest<any>) => {
                    expect(req.method).toEqual('GET');
                    expect(req.url).toContain(`user/appointments/${HCPId}`);
                    return true;
                })
                .flush({ data: mockResponse });
            mockBackend.verify();
        });
    });

    describe('#createAppointment(appointment)', () => {
        const mockAppointment = TestAppointments.createDietFollowUp();
        const resourceId = '1';

        let response: Appointment;

        beforeEach(() => {
            patientsRestService.create.and.returnValue(
                of({
                    resourceId,
                }),
            );

            restService
                .createAppointment(mockAppointment)
                .take(1)
                .subscribe(r => {
                    response = r;
                });
        });

        it('should call create on patientsRestService with the translated appointment', () => {
            expect(patientsRestService.create).toHaveBeenCalledWith(
                AppointmentsTranslator.toApi(mockAppointment),
                {
                    subPath: `/${
                        mockAppointment.patientDetails.backendId
                    }/appointments`,
                },
            );
        });

        it('should add the id from the response to the appointment', () => {
            expect(response.id).toEqual(resourceId);
        });

        it('should set the last modified time to current time when the request is done', () => {
            expect(response.lastModifiedDateTime).toEqual(new Date());
        });
    });

    describe('#updateAppointment(appointment)', () => {
        const mockAppointment = TestAppointments.createDietFollowUp();

        let response: Appointment;

        beforeEach(() => {
            restService.updateAppointment(mockAppointment).subscribe(r => {
                response = r;
            });
        });

        it('should send a PATCH to the appointments endpoint with the translated appointment', () => {
            mockBackend.expectOne((req: HttpRequest<any>) => {
                expect(req.method).toEqual('PATCH');
                expect(req.url).toContain('user/appointments');
                expect(req.body).toEqual(
                    AppointmentsTranslator.toApi(mockAppointment),
                );
                return true;
            }, 'PATCH appointment');

            mockBackend.verify();
        });

        it('should set the last modified time to current time when the request is done', () => {
            const mockResponse = AppointmentsTranslator.toApi(mockAppointment);
            mockBackend.expectOne(() => true).flush(mockResponse);
            expect(response.lastModifiedDateTime).toEqual(new Date());
        });
    });

    describe('#deleteAppointment(appointment)', () => {
        it('should send a PATH to the appointments endpoint with the status updated to "entered-in-error"', () => {
            const mockAppointment = TestAppointments.createDietFollowUp();

            restService.deleteAppointment(mockAppointment).subscribe();

            mockBackend.expectOne((req: HttpRequest<any>) => {
                expect(req.method).toEqual('PATCH');
                expect(req.url).toContain(
                    `user/appointments/${mockAppointment.id}`,
                );
                expect(req.body).toEqual({
                    status: 'entered-in-error',
                });
                return true;
            });
            mockBackend.verify();
        });
    });
});
